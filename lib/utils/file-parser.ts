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
  if (!bytes || bytes.length === 0) {
    throw new Error('The file is empty.')
  }

  const extension = fileName.split('.').pop()?.toLowerCase() || ''

  switch (extension) {
    case 'txt':
    case 'csv':
      return extractTextFromPlainText(bytes)
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
        'Legacy .doc files are not supported. Please save the document as DOCX or PDF and upload it again.'
      )
    case 'ppt':
      throw new Error(
        'Legacy .ppt files are not supported. Please save the presentation as PPTX or PDF and upload it again.'
      )
    default:
      throw new Error(`Unsupported file type: ${mimeType || extension || 'unknown'}`)
  }
}

function extractTextFromPlainText(bytes: Uint8Array): string {
  const text = normalizeText(new TextDecoder('utf-8').decode(bytes))
  if (!text) throw new Error('No readable text was found in the file.')
  return text
}

/**
 * Parse PDF entirely from the uploaded bytes.
 *
 * pdf-parse v2's Node entry is intentionally used here. The previous
 * implementation could be transformed into the browser build by Turbopack,
 * which caused DOMMatrix/fake-worker errors and, with older pdf-parse,
 * fallback attempts to ./test/data/*.pdf.
 */
async function extractTextFromPDF(bytes: Uint8Array): Promise<string> {
  let parser: { getText: () => Promise<{ text?: string }>; destroy: () => Promise<void> } | null = null

  try {
    const pdfParse = await import('pdf-parse')
    const PDFParse = pdfParse.PDFParse

    if (typeof PDFParse !== 'function') {
      throw new Error('PDF parser is unavailable in the server runtime.')
    }

    parser = new PDFParse({
      data: Buffer.from(bytes),
    })

    const result = await parser.getText()
    const text = normalizeText(result?.text || '')

    if (!text) {
      throw new Error(
        'No readable text was found in this PDF. The PDF may be scanned or contain only images.'
      )
    }

    return text
  } catch (error) {
    console.error('PDF parsing error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to parse PDF: ${error.message}`)
    }
    throw new Error('Failed to parse PDF.')
  } finally {
    if (parser) {
      try {
        await parser.destroy()
      } catch (error) {
        console.warn('Failed to destroy PDF parser:', error)
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
    if (!text) throw new Error('No readable text was found in the DOCX file.')
    return text
  } catch (error) {
    console.error('DOCX parsing error:', error)
    if (error instanceof Error) {
      throw new Error(`Failed to parse DOCX file: ${error.message}`)
    }
    throw new Error('Failed to parse DOCX file.')
  }
}

function extractTextFromSpreadsheet(bytes: Uint8Array): string {
  try {
    const workbook = XLSX.read(Buffer.from(bytes), {
      type: 'buffer',
      cellText: true,
      cellDates: true,
    })

    const sections: string[] = []
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]
      if (!sheet) continue
      const text = normalizeText(
        XLSX.utils.sheet_to_csv(sheet, { blankrows: false, FS: ' | ' })
      )
      if (text) sections.push(`Sheet: ${sheetName}\n${text}`)
    }

    const result = normalizeText(sections.join('\n\n'))
    if (!result) throw new Error('No readable data was found in the spreadsheet.')
    return result
  } catch (error) {
    console.error('Spreadsheet parsing error:', error)
    if (error instanceof Error) throw new Error(`Failed to parse spreadsheet: ${error.message}`)
    throw new Error('Failed to parse spreadsheet file.')
  }
}

async function extractTextFromPPTX(bytes: Uint8Array): Promise<string> {
  try {
    const zip = new SimpleZip(bytes)
    const slideNames = zip
      .list()
      .filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))
      .sort((a, b) => Number(a.match(/slide(\d+)\.xml/i)?.[1] || 0) - Number(b.match(/slide(\d+)\.xml/i)?.[1] || 0))

    if (slideNames.length === 0) throw new Error('No slides were found in the PPTX file.')

    const sections: string[] = []
    for (let index = 0; index < slideNames.length; index++) {
      const xml = await zip.readText(slideNames[index])
      const text = [...xml.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/gi)]
        .map((match) => decodeXml(match[1]))
        .join(' ')
      const normalized = normalizeText(text)
      if (normalized) sections.push(`Slide ${index + 1}\n${normalized}`)
    }

    const result = normalizeText(sections.join('\n\n'))
    if (!result) throw new Error('No readable text was found in the PPTX file.')
    return result
  } catch (error) {
    console.error('PPTX parsing error:', error)
    if (error instanceof Error) throw new Error(`Failed to parse PPTX file: ${error.message}`)
    throw new Error('Failed to parse PPTX file.')
  }
}

function normalizeText(text: string): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

class SimpleZip {
  private readonly bytes: Uint8Array
  private readonly entries = new Map<string, { method: number; compressedSize: number; uncompressedSize: number; offset: number }>()

  constructor(bytes: Uint8Array) {
    this.bytes = bytes
    this.index()
  }

  list(): string[] {
    return [...this.entries.keys()]
  }

  async readText(name: string): Promise<string> {
    const entry = this.entries.get(name)
    if (!entry) throw new Error(`ZIP entry not found: ${name}`)

    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
    if (entry.offset < 0 || entry.offset + 30 > this.bytes.length || view.getUint32(entry.offset, true) !== 0x04034b50) {
      throw new Error('Invalid ZIP local header.')
    }

    const nameLength = view.getUint16(entry.offset + 26, true)
    const extraLength = view.getUint16(entry.offset + 28, true)
    const dataStart = entry.offset + 30 + nameLength + extraLength
    const dataEnd = dataStart + entry.compressedSize
    if (dataStart < 0 || dataEnd > this.bytes.length) throw new Error('Invalid ZIP entry bounds.')

    const compressed = this.bytes.slice(dataStart, dataEnd)
    let output: Uint8Array

    if (entry.method === 0) {
      output = compressed
    } else if (entry.method === 8) {
      const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
      output = new Uint8Array(await new Response(stream).arrayBuffer())
    } else {
      throw new Error(`Unsupported ZIP compression method: ${entry.method}`)
    }

    return new TextDecoder('utf-8').decode(output)
  }

  private index(): void {
    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
    const minimum = Math.max(0, this.bytes.length - 0xffff - 22)
    let end = -1

    for (let offset = this.bytes.length - 22; offset >= minimum; offset--) {
      if (offset >= 0 && offset + 4 <= this.bytes.length && view.getUint32(offset, true) === 0x06054b50) {
        end = offset
        break
      }
    }

    if (end < 0) throw new Error('Invalid ZIP archive.')

    const centralDirectorySize = view.getUint32(end + 12, true)
    const centralDirectoryOffset = view.getUint32(end + 16, true)
    let offset = centralDirectoryOffset
    const endOffset = centralDirectoryOffset + centralDirectorySize

    if (endOffset > this.bytes.length) throw new Error('Invalid ZIP central directory bounds.')

    while (offset < endOffset) {
      if (offset + 46 > this.bytes.length || view.getUint32(offset, true) !== 0x02014b50) {
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
      const nameEnd = nameStart + nameLength
      if (nameEnd > this.bytes.length) throw new Error('Invalid ZIP filename bounds.')

      const name = new TextDecoder('utf-8').decode(this.bytes.slice(nameStart, nameEnd))
      this.entries.set(name, { method, compressedSize, uncompressedSize, offset: localOffset })
      offset += 46 + nameLength + extraLength + commentLength
    }
  }
}
