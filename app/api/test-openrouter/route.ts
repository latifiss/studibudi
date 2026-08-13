import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: 'Say "OpenRouter is working!" in exactly 3 words.',
          },
        ],
        max_tokens: 50,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'HTTP-Referer': process.env.OPENROUTER_SITE_URL || 'http://localhost:3000',
          'X-Title': process.env.OPENROUTER_SITE_NAME || 'Studibudi',
          'Content-Type': 'application/json',
        },
      }
    )

    return NextResponse.json({
      success: true,
      message: response.data.choices[0].message.content,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.response?.data?.error?.message || error.message,
    }, { status: 500 })
  }
}