import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { auth } from '@/src/lib/auth/auth'
import { canCreateQuiz, canUpload } from '@/src/lib/subscription'
import { generateQuizFromText } from '@/lib/ai/quiz-generator'
import { extractTextFromBytes } from '@/lib/utils/file-parser'
import { deleteR2Object, getR2Object, getR2ObjectMetadata } from '@/lib/storage/r2'
import { prisma } from '@/src/lib/db/prisma'

export const runtime = 'nodejs'
export const maxDuration = 300

const MAX_FILE_SIZE = 50 * 1024 * 1024

const normalize = (value: unknown) => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()

const quizFingerprint = (questions: unknown) => {
  if (!Array.isArray(questions)) return ''
  const normalized = questions.map((question: any) => ({
    question: normalize(question?.question),
    options: Array.isArray(question?.options) ? question.options.map((option: any) => normalize(option?.label ?? option?.text)).sort() : [],
    correctAnswer: normalize(question?.correctAnswer ?? question?.answer),
  }))
  return crypto.createHash('sha256').update(JSON.stringify(normalized)).digest('hex')
}

export async function POST(req: NextRequest) {
  let uploadedKey: string | null = null
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [quizAllowed, uploadAllowed] = await Promise.all([canCreateQuiz(session.user.id), canUpload(session.user.id)])
    if (!quizAllowed) return NextResponse.json({ error: 'FREE_QUIZ_LIMIT_REACHED', message: 'You have used your 2 free quizzes. Upgrade to Pro for unlimited quizzes.' }, { status: 403 })
    if (!uploadAllowed) return NextResponse.json({ error: 'FREE_UPLOAD_LIMIT_REACHED', message: 'You have used your 2 free uploads. Upgrade to Pro for unlimited uploads.' }, { status: 403 })

    const body = await req.json()
    const key = typeof body?.key === 'string' ? body.key : ''
    const fileName = typeof body?.fileName === 'string' ? body.fileName : ''
    const numQuestions = Math.min(20, Math.max(1, Number(body?.numQuestions) || 5))
    if (!key || !fileName || !key.startsWith(`uploads/${session.user.id}/`)) return NextResponse.json({ error: 'Invalid uploaded file.' }, { status: 400 })

    uploadedKey = key
    const metadata = await getR2ObjectMetadata(key)
    const fileSize = metadata.ContentLength || 0
    if (!fileSize) return NextResponse.json({ error: 'Uploaded file is empty.' }, { status: 400 })
    if (fileSize > MAX_FILE_SIZE) return NextResponse.json({ error: 'File size exceeds the 50MB limit.' }, { status: 413 })

    const object = await getR2Object(key)
    let text: string
    try {
      text = await extractTextFromBytes(object.bytes, fileName, object.contentType)
    } catch (error) {
      console.error('File parsing error:', error)
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to read the uploaded file.' }, { status: 400 })
    }
    if (text.trim().length < 80) return NextResponse.json({ error: 'We could not extract enough readable text from this file. Please upload a text-based document.' }, { status: 400 })

    const history = await prisma.quizHistory.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: { questions: true },
    })

    const previousQuestions = history.flatMap((entry) => {
      if (!Array.isArray(entry.questions)) return []
      return entry.questions.flatMap((question: unknown) => {
        if (!question || typeof question !== 'object') return []
        const value = question as { question?: unknown }
        return typeof value.question === 'string' ? [value.question] : []
      })
    })

    const previousQuizFingerprints = new Set(history.map((entry) => quizFingerprint(entry.questions)).filter(Boolean))

    // Keep the uploaded document as the only source of facts. Previous quizzes
    // are exclusion data only. A nonce prevents request reuse/cached provider output.
    let quiz: Awaited<ReturnType<typeof generateQuizFromText>> | null = null
    let exclusionQuestions = [...previousQuestions]

    for (let attempt = 0; attempt < 5; attempt++) {
      const generationNonce = crypto.randomUUID()
      const generationInput = `${text}\n\n[GENERATION CONTROL]\nGeneration nonce: ${generationNonce}\nUse this only to produce a fresh variation. It is NOT source material and must not appear as a fact in any question.\n[END GENERATION CONTROL]`
      const candidate = await generateQuizFromText(generationInput, numQuestions, undefined, exclusionQuestions)
      const fingerprint = quizFingerprint(candidate.questions)
      if (!previousQuizFingerprints.has(fingerprint)) {
        quiz = candidate
        break
      }
      exclusionQuestions = [...exclusionQuestions, ...candidate.questions.map((question) => question.question)]
    }

    if (!quiz) return NextResponse.json({ error: 'QUIZ_FRESHNESS_FAILED', message: 'We could not create a fresh quiz from this document. Please try uploading again.' }, { status: 503 })

    await prisma.user.update({ where: { id: session.user.id }, data: { uploadsUsed: { increment: 1 } } })

    return NextResponse.json({ success: true, quiz: quiz.questions, title: quiz.title, totalQuestions: quiz.questions.length, textLength: text.length, sourceName: fileName })
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate quiz.' }, { status: 500 })
  } finally {
    if (uploadedKey) await deleteR2Object(uploadedKey)
  }
}
