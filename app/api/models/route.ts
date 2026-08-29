import { NextResponse } from 'next/server'
import { generateQuizWithOpenRouter } from '@/lib/ai/quiz-generator'

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      models: [
        {
          id: process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini',
          name: 'Configured OpenRouter model',
        },
      ],
    })
  } catch (error) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}
