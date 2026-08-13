// lib/utils/file-parser.ts

/**
 * Extracts text content from uploaded files
 * Supports: PDF, DOC, DOCX, PPT, PPTX, TXT
 */

export async function extractTextFromFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const fileType = file.type
  const fileName = file.name.toLowerCase()
  const ext = fileName.split('.').pop() || ''

  // Check if it's a DOCX file (even if MIME type is wrong)
  const isDocx = ext === 'docx' || fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  const isDoc = ext === 'doc' || fileType === 'application/msword'
  const isPdf = ext === 'pdf' || fileType === 'application/pdf'
  const isPptx = ext === 'pptx' || fileType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  const isPpt = ext === 'ppt' || fileType === 'application/vnd.ms-powerpoint'
  const isTxt = ext === 'txt' || fileType === 'text/plain'

  try {
    // Text files
    if (isTxt) {
      return extractTextFromTXT(buffer)
    }

    // PDF files
    if (isPdf) {
      return await extractTextFromPDF(buffer)
    }

    // DOCX files
    if (isDocx) {
      return await extractTextFromDOCX(buffer)
    }

    // DOC files
    if (isDoc) {
      return await extractTextFromDOC(buffer)
    }

    // PPTX files
    if (isPptx) {
      return await extractTextFromPPTX(buffer)
    }

    // PPT files
    if (isPpt) {
      return await extractTextFromPPT(buffer)
    }

    throw new Error(`Unsupported file type: ${fileType || ext}`)
  } catch (error) {
    console.error(`Error parsing ${ext || fileType}:`, error)
    // Return a helpful error message with suggestions
    return getFallbackMessage(ext, fileType)
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
    throw new Error('No text content found in PPTX')
  } catch (error) {
    console.error('PPTX parsing error:', error)
    return 'PPTX files are not fully supported. Please convert to PDF or TXT for best results.'
  }
}

/**
 * Extract text from PPT files (older PowerPoint format)
 */
async function extractTextFromPPT(buffer: ArrayBuffer): Promise<string> {
  // PPT files are OLE compound documents, very difficult to parse
  return 'PPT files are not supported. Please convert to PDF, PPTX, or TXT for best results.'
}

/**
 * Get a fallback error message for unsupported files
 */
function getFallbackMessage(ext: string, fileType: string): string {
  const messages: Record<string, string> = {
    'docx': 'DOCX parsing failed. Please try converting to PDF or TXT.',
    'doc': 'DOC files are not fully supported. Please convert to DOCX, PDF, or TXT.',
    'pptx': 'PPTX files are not fully supported. Please convert to PDF or TXT.',
    'ppt': 'PPT files are not supported. Please convert to PDF, PPTX, or TXT.',
    'pdf': 'PDF parsing failed. Please ensure the file is not password protected.',
    'txt': 'Text file parsing failed.',
  }
  return messages[ext] || messages[fileType] || 'File parsing failed. Please try uploading a different file format (PDF or TXT recommended).'
}