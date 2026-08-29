import * as XLSX from 'xlsx'

export type ParsedFile = {
  text: string
  fileType: string
}

export async function extractTextFromFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())
  return extractTextFromBytes(bytes, file.name, file.type)
}

export async function extractTextFromBytes(
  bytes: Uint8Array,
  fileName: string,
  mimeType = ''
): Promise<string> {
  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  switch (extension) {
    case 'txt':
    case 'csv':
      return new TextDecoder('utf-8').decode(bytes).trim()

    case 'pdf':
      return extractTextFromPDF(bytes)

    case 'docx':
      return extractTextFromDOCX(bytes)

    case 'xlsx':
    case 'xls':
      return extractTextFromSpreadsheet(bytes)

    case 'pptx':
      return extractTextFromPPTX(bytes)

    case 'doc':
      throw new Error(
        'Legacy .doc files are not supported yet. Please save the document as .docx or PDF and upload it again.'
      )

    case 'ppt':
      throw new Error(
        'Legacy .ppt files are not supported yet. Please save the presentation as .pptx or PDF and upload it again.'
      )

    default:
      throw new Error(`Unsupported file type: ${mimeType || extension || 'unknown'}`)
  }
}

/**
 * Extract text from a PDF on the Node.js/Vercel server.
 *
 * IMPORTANT:
 * Use pdf-parse's Node entry point instead of the browser/default entry.
 * The browser entry expects a pdf.worker.mjs file and can cause:
 * "Setting up fake worker failed" on Vercel.
 */
async function extractTextFromPDF(bytes: Uint8Array): Promise<string> {
  let parser: { getText: () => Promise<{ text?: string }>; destroy: () => Promise<void> } | null = null

  try {
    const { PDFParse } = await import('pdf-parse/node')

    parser = new PDFParse({
      data: Buffer.from(bytes),
    })

    const result = await parser.getText()
    const text = normalizeText(result?.text || '')

    if (!text) {
      throw new Error('No readable text was found in the PDF.')
    }

    return text
  } catch (error) {
    console.error('PDF parsing error:', error)

    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`)
    }

    throw new Error('Failed to parse PDF. Please ensure the file is a valid, text-based PDF.')
  } finally {
    if (parser) {
      try {
        await parser.destroy()
      } catch (destroyError) {
        console.warn('Failed to destroy PDF parser:', destroyError)
      }
    }
  }
}

async function extractTextFromDOCX(bytes: Uint8Array): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({
      arrayBuffer: toArrayBuffer(bytes),
    })

    const text = normalizeText(result.value || '')

    if (!text) {
      throw new Error('No readable text was found in the DOCX file.')
    }

    return text
  } catch (error) {
    console.error('DOCX parsing error:', error)

    if (error instanceof Error && error.message.includes('No readable')) {
      throw error
    }

    throw new Error('Failed to parse DOCX. Please ensure the document is not corrupted.')
  }
}

function extractTextFromSpreadsheet(bytes: Uint8Array): string {
  try {
    const workbook = XLSX.read(Buffer.from(bytes), {
      type: 'buffer',
      cellText: true,
      cellDates: true,
    })

    const sections = workbook.SheetNames.map((sheetName) => {
      const sheet = workbook.Sheets[sheetName]
      const csv = XLSX.utils.sheet_to_csv(sheet, {
        blankrows: false,
        FS: ' | ',
      })

      return `Sheet: ${sheetName}\n${csv}`
    })

    const text = normalizeText(sections.join('\n\n'))

    if (!text) {
      throw new Error('No readable text was found in the spreadsheet.')
    }

    return text
  } catch (error) {
    console.error('Spreadsheet parsing error:', error)

    if (error instanceof Error) {
      throw new Error(`Failed to parse spreadsheet: ${error.message}`)
    }

    throw new Error('Failed to parse spreadsheet.')
  }
}

async function extractTextFromPPTX(bytes: Uint8Array): Promise<string> {
  try {
    const zip = new SimpleZip(bytes)
    const slideNames = zip
      .list()
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => {
        const aNumber = Number(a.match(/slide(\d+)\.xml/i)?.[1] || 0)
        const bNumber = Number(b.match(/slide(\d+)\.xml/i)?.[1] || 0)
        return aNumber - bNumber
      })

    const sections: string[] = []

    for (const slideName of slideNames) {
      const xml = await zip.readText(slideName)
      const text = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)]
        .map((match) => decodeXml(match[1]))
        .join(' ')

      if (text.trim()) {
        sections.push(text.trim())
      }
    }

    const result = normalizeText(sections.join('\n\n'))

    if (!result) {
      throw new Error('No readable text was found in the PowerPoint.')
    }

    return result
  } catch (error) {
    console.error('PPTX parsing error:', error)

    if (error instanceof Error && error.message.includes('No readable')) {
      throw error
    }

    throw new Error('Failed to parse PPTX. Please ensure the presentation is not corrupted.')
  }
}

function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

class SimpleZip {
  private readonly bytes: Uint8Array
  private readonly entries = new Map<
    string,
    {
      method: number
      compressedSize: number
      uncompressedSize: number
      offset: number
    }
  >()

  constructor(bytes: Uint8Array) {
    this.bytes = bytes
    this.index()
  }

  list() {
    return [...this.entries.keys()]
  }

  async readText(name: string) {
    const entry = this.entries.get(name)
    if (!entry) throw new Error(`ZIP entry not found: ${name}`)

    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset,
      this.bytes.byteLength
    )

    if (view.getUint32(entry.offset, true) !== 0x04034b50) {
      throw new Error('Invalid ZIP local header.')
    }

    const nameLength = view.getUint16(entry.offset + 26, true)
    const extraLength = view.getUint16(entry.offset + 28, true)
    const dataStart = entry.offset + 30 + nameLength + extraLength
    const compressed = this.bytes.slice(
      dataStart,
      dataStart + entry.compressedSize
    )

    let output: Uint8Array

    if (entry.method === 0) {
      output = compressed
    } else if (entry.method === 8) {
      const stream = new Blob([compressed])
        .stream()
        .pipeThrough(new DecompressionStream('deflate-raw'))

      output = new Uint8Array(await new Response(stream).arrayBuffer())
    } else {
      throw new Error(`Unsupported ZIP compression method: ${entry.method}`)
    }

    return new TextDecoder('utf-8').decode(output)
  }

  private index() {
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset,
      this.bytes.byteLength
    )

    const minimum = Math.max(0, this.bytes.length - 0xffff - 22)
    let end = -1

    for (let offset = this.bytes.length - 22; offset >= minimum; offset--) {
      if (view.getUint32(offset, true) === 0x06054b50) {
        end = offset
        break
      }
    }

    if (end < 0) throw new Error('Invalid ZIP archive.')

    const centralDirectorySize = view.getUint32(end + 12, true)
    const centralDirectoryOffset = view.getUint32(end + 16, true)
    let offset = centralDirectoryOffset
    const endOffset = centralDirectoryOffset + centralDirectorySize

    while (offset < endOffset) {
      if (view.getUint32(offset, true) !== 0x02014b50) {
        throw new Error('Invalid ZIP central directory.')
      }

      const method = view.getUint16(offset + 10, true)
      const compressedSize = view.getUint32(offset + 20, true)
      const uncompressedSize = view.getUint32(offset + 24, true)
      const nameLength = view.getUint16(offset + 28, true)
      const extraLength = view.getUint16(offset + 30, true)
      const commentLength = view.getUint16(offset + 32, true)
      const localOffset = view.getUint32(offset + 42, true)
      const nameStart = offset + 46
      const name = new TextDecoder('utf-8').decode(
        this.bytes.slice(nameStart, nameStart + nameLength)
      )

      this.entries.set(name, {
        method,
        compressedSize,
        uncompressedSize,
        offset: localOffset,
      })

      offset += 46 + nameLength + extraLength + commentLength
    }
  }
}
