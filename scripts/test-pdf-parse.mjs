import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/legacy/build/pdf.mjs'

GlobalWorkerOptions.workerSrc = ''

const pdfSource = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<</Font<</F1 4 0 R>>>>/Contents 5 0 R>>endobj
4 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
5 0 obj<</Length 51>>stream
BT /F1 24 Tf 72 720 Td (Photosynthesis study notes) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000334 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
434
%%EOF
`

const data = new TextEncoder().encode(pdfSource)
const copy = new Uint8Array(data.byteLength)
copy.set(data)

const pdf = await getDocument({
  data: copy,
  disableAutoFetch: true,
  disableStream: true,
  disableFontFace: true,
  useSystemFonts: false,
  isEvalSupported: false,
}).promise

const page = await pdf.getPage(1)
const content = await page.getTextContent()
const text = content.items.map((item) => ('str' in item ? item.str : '')).join(' ')
page.cleanup()
await pdf.destroy()

console.log('EXTRACTED:', text)
if (!text.toLowerCase().includes('photosynthesis')) {
  process.exit(1)
}
