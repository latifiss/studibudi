import * as XLSX from 'xlsx'

export type ParsedFile = {
  text: string
  fileType: string
}

/**
 * Extract text from a browser File.
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const bytes = new Uint8Array(await file.arrayBuffer())

  return extractTextFromBytes(
    bytes,
    file.name,
    file.type
  )
}

/**
 * Extract text from raw file bytes.
 *
 * This function is intentionally server-safe and does not depend
 * on a filesystem path.
 */
export async function extractTextFromBytes(
  bytes: Uint8Array,
  fileName: string,
  mimeType = ''
): Promise<string> {
  if (!bytes || bytes.length === 0) {
    throw new Error('The file is empty.')
  }

  const extension =
    fileName
      .split('.')
      .pop()
      ?.toLowerCase() || ''

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
      throw new Error(
        `Unsupported file type: ${mimeType || extension || 'unknown'}`
      )
  }
}

/**
 * TXT / CSV
 */
function extractTextFromPlainText(bytes: Uint8Array): string {
  const text = new TextDecoder('utf-8').decode(bytes)

  const normalized = normalizeText(text)

  if (!normalized) {
    throw new Error('No readable text was found in the file.')
  }

  return normalized
}

/**
 * PDF.js can mis-read a Node Buffer / pooled ArrayBuffer view.
 * Always pass a standalone Uint8Array of the uploaded bytes.
 */
function toStandaloneBytes(bytes: Uint8Array): Uint8Array {
  const copy = new Uint8Array(bytes.byteLength)
  copy.set(bytes)
  return copy
}

/**
 * PDF
 *
 * Uses pdfjs-dist on the server. Do not use pdf-parse — its entry
 * file tries to open ./test/data/05-versions-space.pdf when bundled.
 */
async function extractTextFromPDF(
  bytes: Uint8Array
): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')

    if (pdfjs.GlobalWorkerOptions) {
      pdfjs.GlobalWorkerOptions.workerSrc = ''
    }

    const loadingTask = pdfjs.getDocument({
      data: toStandaloneBytes(bytes),
      disableAutoFetch: true,
      disableStream: true,
      disableFontFace: true,
      useSystemFonts: false,
      isEvalSupported: false,
    })

    const pdf = await loadingTask.promise

    const pages: string[] = []

    for (
      let pageNumber = 1;
      pageNumber <= pdf.numPages;
      pageNumber++
    ) {
      const page = await pdf.getPage(pageNumber)

      const content =
        await page.getTextContent()

      const pageText = content.items
        .map((item) => {
          if (
            typeof item === 'object' &&
            item !== null &&
            'str' in item
          ) {
            return String(item.str)
          }

          return ''
        })
        .join(' ')

      if (pageText.trim()) {
        pages.push(
          `Page ${pageNumber}\n${pageText.trim()}`
        )
      }

      page.cleanup()
    }

    const text = pages.join('\n\n').trim()

    if (!text) {
      throw new Error(
        'No readable text was found in this PDF. The PDF may be scanned or contain only images.'
      )
    }

    return text
  } catch (error) {
    console.error(
      'PDF parsing error:',
      error
    )

    throw new Error(
      `Failed to parse PDF: ${
        error instanceof Error
          ? error.message
          : 'Unknown PDF parsing error'
      }`
    )
  }
}

/**
 * DOCX
 */
async function extractTextFromDOCX(
  bytes: Uint8Array
): Promise<string> {
  try {
    const mammoth = await import('mammoth')

    const arrayBuffer = toArrayBuffer(bytes)

    const result =
      await mammoth.extractRawText({
        arrayBuffer,
      })

    const text = normalizeText(
      result.value || ''
    )

    if (!text) {
      throw new Error(
        'No readable text was found in the DOCX file.'
      )
    }

    return text
  } catch (error) {
    console.error('DOCX parsing error:', error)

    if (error instanceof Error) {
      throw new Error(
        `Failed to parse DOCX file: ${error.message}`
      )
    }

    throw new Error(
      'Failed to parse DOCX file. Please try converting it to PDF or TXT.'
    )
  }
}

/**
 * XLS / XLSX
 */
function extractTextFromSpreadsheet(
  bytes: Uint8Array
): string {
  try {
    const workbook = XLSX.read(
      Buffer.from(bytes),
      {
        type: 'buffer',
        cellText: true,
        cellDates: true,
      }
    )

    const sections: string[] = []

    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName]

      if (!sheet) {
        continue
      }

      const csv = XLSX.utils.sheet_to_csv(
        sheet,
        {
          blankrows: false,
          FS: ' | ',
        }
      )

      const normalized = normalizeText(csv)

      if (normalized) {
        sections.push(
          `Sheet: ${sheetName}\n${normalized}`
        )
      }
    }

    const text = normalizeText(
      sections.join('\n\n')
    )

    if (!text) {
      throw new Error(
        'No readable data was found in the spreadsheet.'
      )
    }

    return text
  } catch (error) {
    console.error(
      'Spreadsheet parsing error:',
      error
    )

    if (error instanceof Error) {
      throw new Error(
        `Failed to parse spreadsheet: ${error.message}`
      )
    }

    throw new Error(
      'Failed to parse spreadsheet file.'
    )
  }
}

/**
 * PPTX
 *
 * PPTX is a ZIP archive containing XML.
 * We extract the text from each slide in order.
 */
async function extractTextFromPPTX(
  bytes: Uint8Array
): Promise<string> {
  try {
    const zip = new SimpleZip(bytes)

    const slideNames = zip
      .list()
      .filter((name) =>
        /^ppt\/slides\/slide\d+\.xml$/i.test(name)
      )
      .sort((a, b) => {
        const aNumber =
          Number(
            a.match(
              /slide(\d+)\.xml/i
            )?.[1] || 0
          )

        const bNumber =
          Number(
            b.match(
              /slide(\d+)\.xml/i
            )?.[1] || 0
          )

        return aNumber - bNumber
      })

    if (slideNames.length === 0) {
      throw new Error(
        'No slides were found in the PPTX file.'
      )
    }

    const sections: string[] = []

    for (
      let index = 0;
      index < slideNames.length;
      index++
    ) {
      const slideName = slideNames[index]

      const xml =
        await zip.readText(slideName)

      const text = [
        ...xml.matchAll(
          /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/gi
        ),
      ]
        .map((match) =>
          decodeXml(match[1])
        )
        .join(' ')

      const normalized =
        normalizeText(text)

      if (normalized) {
        sections.push(
          `Slide ${index + 1}\n${normalized}`
        )
      }
    }

    const result = normalizeText(
      sections.join('\n\n')
    )

    if (!result) {
      throw new Error(
        'No readable text was found in the PPTX file.'
      )
    }

    return result
  } catch (error) {
    console.error(
      'PPTX parsing error:',
      error
    )

    if (error instanceof Error) {
      throw new Error(
        `Failed to parse PPTX file: ${error.message}`
      )
    }

    throw new Error(
      'Failed to parse PPTX file.'
    )
  }
}

/**
 * Normalize extracted text so the AI receives
 * clean and reasonably compact content.
 */
function normalizeText(
  text: string
): string {
  return text
    .replace(/\u0000/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n[ \t]+/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/**
 * Decode the most common XML entities.
 */
function decodeXml(
  value: string
): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCharCode(
        Number(code)
      )
    )
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCharCode(
        parseInt(code, 16)
      )
    )
}

/**
 * Convert Uint8Array into a standalone ArrayBuffer.
 */
function toArrayBuffer(
  bytes: Uint8Array
): ArrayBuffer {
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer
}

/**
 * Minimal ZIP reader used for PPTX.
 */
class SimpleZip {
  private readonly bytes: Uint8Array

  private readonly entries =
    new Map<
      string,
      {
        method: number
        compressedSize: number
        uncompressedSize: number
        offset: number
      }
    >()

  constructor(
    bytes: Uint8Array
  ) {
    this.bytes = bytes
    this.index()
  }

  list(): string[] {
    return [
      ...this.entries.keys(),
    ]
  }

  async readText(
    name: string
  ): Promise<string> {
    const entry =
      this.entries.get(name)

    if (!entry) {
      throw new Error(
        `ZIP entry not found: ${name}`
      )
    }

    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset,
      this.bytes.byteLength
    )

    if (
      entry.offset + 30 >
      this.bytes.length ||
      view.getUint32(
        entry.offset,
        true
      ) !== 0x04034b50
    ) {
      throw new Error(
        'Invalid ZIP local header.'
      )
    }

    const nameLength =
      view.getUint16(
        entry.offset + 26,
        true
      )

    const extraLength =
      view.getUint16(
        entry.offset + 28,
        true
      )

    const dataStart =
      entry.offset +
      30 +
      nameLength +
      extraLength

    const dataEnd =
      dataStart +
      entry.compressedSize

    if (
      dataStart < 0 ||
      dataEnd > this.bytes.length
    ) {
      throw new Error(
        'Invalid ZIP entry bounds.'
      )
    }

    const compressed =
      this.bytes.slice(
        dataStart,
        dataEnd
      )

    let output: Uint8Array

    if (entry.method === 0) {
      output = compressed
    } else if (entry.method === 8) {
      const stream =
        new Blob([
          compressed,
        ])
          .stream()
          .pipeThrough(
            new DecompressionStream(
              'deflate-raw'
            )
          )

      output =
        new Uint8Array(
          await new Response(
            stream
          ).arrayBuffer()
        )
    } else {
      throw new Error(
        `Unsupported ZIP compression method: ${entry.method}`
      )
    }

    if (
      entry.uncompressedSize > 0 &&
      output.length !==
        entry.uncompressedSize
    ) {
      console.warn(
        `ZIP entry size mismatch for ${name}`
      )
    }

    return new TextDecoder(
      'utf-8'
    ).decode(output)
  }

  private index(): void {
    const view = new DataView(
      this.bytes.buffer,
      this.bytes.byteOffset,
      this.bytes.byteLength
    )

    /*
     * Find End of Central Directory.
     *
     * ZIP comments can be up to 65535 bytes,
     * so search backwards through that range.
     */
    const minimum = Math.max(
      0,
      this.bytes.length -
        0xffff -
        22
    )

    let end = -1

    for (
      let offset =
        this.bytes.length - 22;
      offset >= minimum;
      offset--
    ) {
      if (
        offset >= 0 &&
        offset + 4 <=
          this.bytes.length &&
        view.getUint32(
          offset,
          true
        ) === 0x06054b50
      ) {
        end = offset
        break
      }
    }

    if (end < 0) {
      throw new Error(
        'Invalid ZIP archive.'
      )
    }

    const centralDirectorySize =
      view.getUint32(
        end + 12,
        true
      )

    const centralDirectoryOffset =
      view.getUint32(
        end + 16,
        true
      )

    let offset =
      centralDirectoryOffset

    const endOffset =
      centralDirectoryOffset +
      centralDirectorySize

    while (
      offset < endOffset
    ) {
      if (
        offset + 46 >
        this.bytes.length ||
        view.getUint32(
          offset,
          true
        ) !== 0x02014b50
      ) {
        throw new Error(
          'Invalid ZIP central directory.'
        )
      }

      const method =
        view.getUint16(
          offset + 10,
          true
        )

      const compressedSize =
        view.getUint32(
          offset + 20,
          true
        )

      const uncompressedSize =
        view.getUint32(
          offset + 24,
          true
        )

      const nameLength =
        view.getUint16(
          offset + 28,
          true
        )

      const extraLength =
        view.getUint16(
          offset + 30,
          true
        )

      const commentLength =
        view.getUint16(
          offset + 32,
          true
        )

      const localOffset =
        view.getUint32(
          offset + 42,
          true
        )

      const nameStart =
        offset + 46

      const nameEnd =
        nameStart + nameLength

      if (
        nameEnd >
        this.bytes.length
      ) {
        throw new Error(
          'Invalid ZIP filename bounds.'
        )
      }

      const name =
        new TextDecoder(
          'utf-8'
        ).decode(
          this.bytes.slice(
            nameStart,
            nameEnd
          )
        )

      this.entries.set(
        name,
        {
          method,
          compressedSize,
          uncompressedSize,
          offset:
            localOffset,
        }
      )

      offset +=
        46 +
        nameLength +
        extraLength +
        commentLength
    }
  }
}