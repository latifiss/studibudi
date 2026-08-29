import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { auth } from '@/src/lib/auth/auth'
import { canUpload } from '@/src/lib/subscription'
import { createR2UploadUrl } from '@/lib/storage/r2'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_EXTENSIONS = new Set(['pdf', 'doc', 'docx', 'ppt', 'pptx', 'txt', 'csv', 'xls', 'xlsx'])

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized', message: 'Please sign in before uploading a file.' }, { status: 401 })
    }

    let body: { fileName?: unknown; fileSize?: unknown; contentType?: unknown }
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: 'INVALID_REQUEST', message: 'Invalid upload request.' }, { status: 400 })
    }

    const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : ''
    const fileSize = Number(body.fileSize)
    const contentType = typeof body.contentType === 'string' && body.contentType.trim()
      ? body.contentType.trim()
      : 'application/octet-stream'

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ error: 'INVALID_FILE', message: 'The uploaded file information is invalid.' }, { status: 400 })
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'FILE_TOO_LARGE', message: 'File size exceeds the 50MB limit.' }, { status: 413 })
    }

    const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() || '' : ''
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json({ error: 'UNSUPPORTED_FILE_TYPE', message: 'Unsupported file type. Please upload PDF, DOC, DOCX, PPT, PPTX, TXT, CSV, XLS, or XLSX.' }, { status: 400 })
    }

    // Verify entitlement separately. If the database entitlement check itself fails,
    // expose the real server-side failure instead of hiding it behind a generic error.
    try {
      if (!(await canUpload(session.user.id))) {
        return NextResponse.json({
          error: 'FREE_UPLOAD_LIMIT_REACHED',
          message: 'You have used your 2 free uploads. Upgrade to Pro for unlimited uploads.',
        }, { status: 403 })
      }
    } catch (error) {
      console.error('[presign] canUpload failed:', error)
      return NextResponse.json({
        error: 'UPLOAD_ENTITLEMENT_FAILED',
        message: error instanceof Error ? error.message : 'Unable to verify upload allowance.',
      }, { status: 500 })
    }

    const safeName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^\.+/, '_')
      .slice(-120)

    const key = `uploads/${session.user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`

    try {
      const uploadUrl = await createR2UploadUrl(key, contentType)

      return NextResponse.json({
        success: true,
        uploadUrl,
        key,
        maxFileSize: MAX_FILE_SIZE,
        contentType,
      })
    } catch (error) {
      console.error('[presign] R2 signing failed:', error)

      return NextResponse.json({
        error: 'R2_PRESIGN_FAILED',
        message: error instanceof Error ? error.message : 'Unable to create R2 upload URL.',
      }, { status: 500 })
    }
  } catch (error) {
    console.error('[presign] unexpected error:', error)

    return NextResponse.json({
      error: 'UPLOAD_PREPARATION_FAILED',
      message: error instanceof Error ? error.message : 'Failed to prepare file upload. Please try again.',
    }, { status: 500 })
  }
}
