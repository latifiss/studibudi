// app/api/models/route.ts
import { NextResponse } from 'next/server'
import { getAvailableModels } from '@/lib/ai/quiz-generator'

export async function GET() {
  try {
    const models = await getAvailableModels()
    
    // Filter for chat/completion models
    const chatModels = models
      .filter((m: any) => m.features?.includes('chat'))
      .map((m: any) => ({
        id: m.id,
        name: m.name,
        context_length: m.context_length,
        pricing: m.pricing,
      }))
    
    return NextResponse.json({
      success: true,
      models: chatModels,
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch models' },
      { status: 500 }
    )
  }
}