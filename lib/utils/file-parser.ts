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
      throw new Error('Legacy .doc files are not supported yet. Please save the document as .docx or PDF and upload it again.')

    case 'ppt':
      throw new Error('Legacy .ppt files are not supported yet. Please save the presentation as .pptx or PDF and upload it again.')

    default:
      throw new Error(`Unsupported file type: ${mimeType || extension || 'unknown'}`)
  }
}

async function extractTextFromPDF(bytes: Uint8Array): Promise<string> {
  const pdfParse = await import('pdf-parse')
  const data = await pdfParse.default(Buffer.from(bytes))
  return normalizeText(data.text)
}

async function extractTextFromDOCX(bytes: Uint8Array): Promise<string> {
  const mammoth = await import('mammoth')
  const result = await mammoth.extractRawText({ arrayBuffer: toArrayBuffer(bytes) })
  return normalizeText(result.value)
}

function extractTextFromSpreadsheet(bytes: Uint8Array): string {
  const workbook = XLSX.read(Buffer.from(bytes), { type: 'buffer', cellText: true, cellDates: true })
  const sections = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false, FS: ' | ' })
    return `Sheet: ${sheetName}\n${csv}`
  })

  return normalizeText(sections.join('\n\n'))
}

async function extractTextFromPPTX(bytes: Uint8Array): Promise<string> {
  const zip = new SimpleZip(bytes)
  const slideNames = zip.list().filter((name) => /^ppt\/slides\/slide\d+\.xml$/i.test(name))

  const orderedSlides = slideNames.sort((a, b) => {
    const aNumber = Number(a.match(/slide(\d+)\.xml/i)?.[1] || 0)
    const bNumber = Number(b.match(/slide(\d+)\.xml/i)?.[1] || 0)
    return aNumber - bNumber
  })

  const sections: string[] = []

  for (const slideName of orderedSlides) {
    const xml = await zip.readText(slideName)
    const text = [...xml.matchAll(/<a:t[^>]*>([\s\S]*?)<\/a:t>/g)]
      .map((match) => decodeXml(match[1]))
      .join(' ')

    if (text.trim()) {
      sections.push(text.trim())
    }
  }

  return normalizeText(sections.join('\n\n'))
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
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer
}

class SimpleZip {
  private readonly bytes: Uint8Array
  private readonly entries = new Map<string, { method: number; compressedSize: number; uncompressedSize: number; offset: number }>()

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

    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
    if (view.getUint32(entry.offset, true) !== 0x04034b50) {
      throw new Error('Invalid ZIP local header.')
    }

    const nameLength = view.getUint16(entry.offset + 26, true)
    const extraLength = view.getUint16(entry.offset + 28, true)
    const dataStart = entry.offset + 30 + nameLength + extraLength
    const compressed = this.bytes.slice(dataStart, dataStart + entry.compressedSize)

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

  private index() {
    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset, this.bytes.byteLength)
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
      if (view.getUint32(offset, true) !== 0x02014b50) throw new Error('Invalid ZIP central directory.')

      const method = view.getUint16(offset + 10, true)
      const compressedSize = view.getUint32(offset + 20, true)
      const uncompressedSize = view.getUint32(offset + 24, true)
      const nameLength = view.getUint16(offset + 28, true)
      const extraLength = view.getUint16(offset + 30, true)
      const commentLength = view.getUint16(offset + 32, true)
      const localOffset = view.getUint32(offset + 42, true)
      const nameStart = offset + 46
      const name = new TextDecoder('utf-8').decode(this.bytes.slice(nameStart, nameStart + nameLength))

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
