import { NextResponse } from 'next/server'
import { auth } from '@/src/lib/auth/auth'
import { prisma } from '@/src/lib/db/prisma'

export async function GET(req: Request) {
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

    const quizzes = await prisma.quizHistory.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        sourceName: true,
        totalQuestions: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error('Failed to fetch quiz history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz history' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
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

    const body = await req.json()
    const questions = Array.isArray(body?.questions) ? body.questions : []

    if (!questions.length) {
      return NextResponse.json(
        { error: 'No quiz questions provided' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quizHistory.create({
      data: {
        userId: session.user.id,
        title: typeof body?.title === 'string' && body.title.trim() ? body.title : `Quiz ${new Date().toLocaleDateString()}`,
        sourceName: typeof body?.sourceName === 'string' && body.sourceName.trim() ? body.sourceName : 'Uploaded file',
        totalQuestions: questions.length,
        questions: questions as any,
      },
    })

    return NextResponse.json({
      success: true,
      quiz: {
        id: quiz.id,
        title: quiz.title,
        sourceName: quiz.sourceName,
        totalQuestions: quiz.totalQuestions,
      },
    })
  } catch (error) {
    console.error('Failed to save quiz history:', error)
    return NextResponse.json(
      { error: 'Failed to save quiz history' },
      { status: 500 }
    )
  }
}
