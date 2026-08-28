import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { canCreateQuiz, canUpload } from '@/src/lib/subscription'
import { generateQuizFromText } from '@/lib/ai/quiz-generator'
import { extractTextFromFile } from '@/lib/utils/file-parser'
import { prisma } from '@/src/lib/db/prisma'

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers })
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [quizAllowed, uploadAllowed] = await Promise.all([
      canCreateQuiz(session.user.id),
      canUpload(session.user.id),
    ])

    if (!quizAllowed) {
      return NextResponse.json({
        error: 'FREE_QUIZ_LIMIT_REACHED',
        message: 'You have used your 2 free quizzes. Upgrade to Pro for unlimited quizzes.',
      }, { status: 403 })
    }

    if (!uploadAllowed) {
      return NextResponse.json({
        error: 'FREE_UPLOAD_LIMIT_REACHED',
        message: 'You have used your 2 free uploads. Upgrade to Pro for unlimited uploads.',
      }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 5

    if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit. Please upload a smaller file.' }, { status: 400 })
    }

    let text
    try {
      text = await extractTextFromFile(file)
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      return NextResponse.json({ error: 'Failed to read file. Please try a different format (PDF or TXT recommended).' }, { status: 400 })
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'No text content found in the uploaded file. Please check the file content.' }, { status: 400 })
    }

    const maxTextLength = 10000
    if (text.length > maxTextLength) text = text.substring(0, maxTextLength)

    try {
      const quiz = await Promise.race([
        generateQuizFromText(text, numQuestions),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Request timeout - please try again')), 60000))
      ]) as { questions: Array<{ question: string; options: Array<{ id: string; label: string }>; correctAnswer: string; explanation: string }> }

      await prisma.user.update({
        where: { id: session.user.id },
        data: { uploadsUsed: { increment: 1 } },
      })

      return NextResponse.json({
        success: true,
        quiz: quiz.questions,
        totalQuestions: quiz.questions.length,
        textLength: text.length,
      })
    } catch (aiError: unknown) {
      console.error('AI generation error:', aiError)
      const message = aiError instanceof Error ? aiError.message : 'Failed to generate quiz. Please try again.'
      if (message.includes('ECONNRESET')) return NextResponse.json({ error: 'Connection timeout. Please try again.' }, { status: 504 })
      return NextResponse.json({ error: message }, { status: 500 })
    }
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to generate quiz' }, { status: 500 })
  }
}
