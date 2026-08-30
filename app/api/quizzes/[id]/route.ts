import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz id is required' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    const quiz = await prisma.quizHistory.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404, headers: { 'Cache-Control': 'no-store' } }
      )
    }

    return NextResponse.json(
      {
        quiz: {
          id: quiz.id,
          title: quiz.title,
          sourceName: quiz.sourceName,
          totalQuestions: quiz.totalQuestions,
          questions: quiz.questions,
        },
      },
      { headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  } catch (error) {
    console.error('Failed to fetch quiz by id:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
