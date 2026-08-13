import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const quiz = await prisma.quizHistory.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        sourceName: quiz.sourceName,
        totalQuestions: quiz.totalQuestions,
        questions: quiz.questions,
      },
    })
  } catch (error) {
    console.error('Failed to fetch quiz by id:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}
