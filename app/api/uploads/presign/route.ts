import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { auth } from '@/src/lib/auth/auth'
import { canUpload } from '@/src/lib/subscription'
import { createR2UploadUrl } from '@/lib/storage/r2'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set([
  'pdf',
  'doc',
  'docx',
  'ppt',
  'pptx',
  'txt',
  'csv',
  'xls',
  'xlsx',
])

const getExtension = (fileName: string) => fileName.split('.').pop()?.toLowerCase() || ''

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!(await canUpload(session.user.id))) {
      return NextResponse.json({
        error: 'FREE_UPLOAD_LIMIT_REACHED',
        message: 'You have used your 2 free uploads. Upgrade to Pro for unlimited uploads.',
      }, { status: 403 })
    }

    const body = await req.json()
    const fileName = typeof body?.fileName === 'string' ? body.fileName.trim() : ''
    const fileSize = Number(body?.fileSize)
    const contentType = typeof body?.contentType === 'string' ? body.contentType : 'application/octet-stream'

    if (!fileName || !Number.isFinite(fileSize)) {
      return NextResponse.json({ error: 'Invalid file metadata.' }, { status: 400 })
    }

    if (fileSize <= 0) {
      return NextResponse.json({ error: 'The selected file is empty.' }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 50MB limit.' }, { status: 413 })
    }

    const extension = getExtension(fileName)

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 400 })
    }

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-120)
    const key = `uploads/${session.user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`
    const uploadUrl = createR2UploadUrl(key)

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
      contentType,
    })
  } catch (error) {
    console.error('Failed to create upload URL:', error)
    return NextResponse.json({ error: 'Failed to prepare file upload.' }, { status: 500 })
  }
}
