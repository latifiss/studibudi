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

/**
 * Extract text from TXT files
 */
function extractTextFromTXT(buffer: ArrayBuffer): string {
  return new TextDecoder('utf-8').decode(buffer)
}

/**
 * Extract text from PDF files using pdf-parse
 */
async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    // Dynamic import to avoid issues if pdf-parse is not installed
    const pdfParse = await import('pdf-parse')
    const data = await pdfParse.default(Buffer.from(buffer))
    return data.text
  } catch (error) {
    console.error('PDF parsing error:', error)
    // Fallback: try to read as text
    const text = new TextDecoder('utf-8').decode(buffer)
    if (text.trim().length > 0) {
      return text
    }
    throw new Error('Failed to parse PDF file. Please ensure the file is not corrupted or password protected.')
  }
}

/**
 * Extract text from DOCX files using mammoth
 */
async function extractTextFromDOCX(buffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    if (result.value && result.value.trim().length > 0) {
      return result.value
    }
    // If mammoth returns empty, try converting to HTML and extract text
    const htmlResult = await mammoth.convertToHtml({ arrayBuffer: buffer })
    if (htmlResult.value) {
      // Strip HTML tags to get plain text
      const plainText = htmlResult.value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
      if (plainText.length > 0) {
        return plainText
      }
    }
    throw new Error('No text content found in DOCX file')
  } catch (error) {
    console.error('DOCX parsing error:', error)
    // Try a simpler approach - sometimes DOCX is just XML
    try {
      const text = new TextDecoder('utf-8').decode(buffer)
      // Look for text between tags
      const matches = text.match(/>([^<]+)</g)
      if (matches) {
        const extracted = matches.map(m => m.replace(/[<>]/g, '').trim()).filter(s => s.length > 0).join(' ')
        if (extracted.length > 0) {
          return extracted
        }
      }
    } catch {
      // Fall through to error
    }
    throw new Error('Failed to parse DOCX file. Please try converting to PDF or TXT.')
  }
}

/**
 * Extract text from DOC files (older Word format)
 */
async function extractTextFromDOC(buffer: ArrayBuffer): Promise<string> {
  try {
    // Try using mammoth for DOC as well (it supports some DOC files)
    const mammoth = await import('mammoth')
    const result = await mammoth.extractRawText({ arrayBuffer: buffer })
    if (result.value && result.value.trim().length > 0) {
      return result.value
    }
    throw new Error('No text content found')
  } catch {
    // DOC files are difficult to parse. Give user a helpful message.
    return 'DOC files are not fully supported. Please convert to DOCX, PDF, or TXT for best results.\n\nTip: Open the file in Word and save as DOCX or PDF.'
  }
}

/**
 * Extract text from PPTX files
 */
async function extractTextFromPPTX(buffer: ArrayBuffer): Promise<string> {
  try {
    // For PPTX, we'll try a simple text extraction from the XML
    const text = new TextDecoder('utf-8').decode(buffer)
    // Look for text in the XML
    const matches = text.match(/>([^<]+)</g)
    if (matches) {
      const extracted = matches
        .map(m => m.replace(/[<>]/g, '').trim())
        .filter(s => s.length > 0)
        .join(' ')
      if (extracted.length > 0) {
        return extracted
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
