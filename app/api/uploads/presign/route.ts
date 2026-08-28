import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { auth } from '@/src/lib/auth/auth'
import { canUpload } from '@/src/lib/subscription'
import { createR2UploadUrl } from '@/lib/storage/r2'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate the request.
    const session = await auth.api.getSession({ headers: req.headers })

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Please sign in before uploading a file.' },
        { status: 401 },
      )
    }

    // 2. Check the user's upload entitlement before creating a storage URL.
    try {
      const uploadAllowed = await canUpload(session.user.id)

      if (!uploadAllowed) {
        return NextResponse.json(
          {
            error: 'FREE_UPLOAD_LIMIT_REACHED',
            message:
              'You have used your 2 free uploads. Upgrade to Pro for unlimited uploads.',
          },
          { status: 403 },
        )
      }
    } catch (error) {
      console.error('Upload entitlement check failed:', error)

      return NextResponse.json(
        {
          error: 'UPLOAD_LIMIT_CHECK_FAILED',
          message: 'Unable to verify your upload allowance. Please try again.',
        },
        { status: 500 },
      )
    }

    // 3. Validate the file metadata sent by the browser.
    let body: unknown

    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { error: 'INVALID_REQUEST', message: 'Invalid upload request.' },
        { status: 400 },
      )
    }

    const fileName =
      typeof (body as { fileName?: unknown })?.fileName === 'string'
        ? (body as { fileName: string }).fileName.trim()
        : ''

    const fileSize = Number((body as { fileSize?: unknown })?.fileSize)

    const requestedContentType =
      typeof (body as { contentType?: unknown })?.contentType === 'string'
        ? (body as { contentType: string }).contentType.trim()
        : ''

    const contentType = requestedContentType || 'application/octet-stream'

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json(
        { error: 'INVALID_FILE', message: 'The uploaded file information is invalid.' },
        { status: 400 },
      )
    }

    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: 'FILE_TOO_LARGE',
          message: 'File size exceeds the 50MB limit.',
        },
        { status: 413 },
      )
    }

    const extension = fileName.includes('.')
      ? fileName.split('.').pop()?.toLowerCase() || ''
      : ''

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        {
          error: 'UNSUPPORTED_FILE_TYPE',
          message:
            'Unsupported file type. Please upload PDF, DOC, DOCX, PPT, PPTX, TXT, CSV, XLS, or XLSX.',
        },
        { status: 400 },
      )
    }

    // Keep the original extension while preventing path traversal and unsafe keys.
    const safeName = fileName
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/^\.+/, '_')
      .slice(-120)

    const key = `uploads/${session.user.id}/${Date.now()}-${crypto.randomUUID()}-${safeName}`

    // 4. Generate the signed R2 PUT URL on the server.
    // This does not upload the file through Vercel; the browser uploads directly to R2.
    let uploadUrl: string

    try {
      uploadUrl = await createR2UploadUrl(key, contentType)
    } catch (error) {
      console.error('R2 presign failed:', error)

      const details = error instanceof Error ? error.message : 'Unknown R2 error'

      return NextResponse.json(
        {
          error: 'R2_PRESIGN_FAILED',
          message:
            process.env.NODE_ENV === 'development'
              ? details
              : 'Unable to connect to file storage. Please try again.',
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      maxFileSize: MAX_FILE_SIZE,
      contentType,
    })
  } catch (error) {
    console.error('Failed to prepare file upload:', error)

    return NextResponse.json(
      {
        error: 'UPLOAD_PREPARATION_FAILED',
        message: 'Failed to prepare file upload. Please try again.',
      },
      { status: 500 },
    )
  }
}
