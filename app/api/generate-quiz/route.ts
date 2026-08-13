// app/api/generate-quiz/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateQuizFromText } from '@/lib/ai/quiz-generator'
import { extractTextFromFile } from '@/lib/utils/file-parser'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const numQuestions = parseInt(formData.get('numQuestions') as string) || 5

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Check file size (limit to 5MB for now)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit. Please upload a smaller file.' },
        { status: 400 }
      )
    }

    // Extract text from the uploaded file
    let text
    try {
      text = await extractTextFromFile(file)
    } catch (parseError) {
      console.error('File parsing error:', parseError)
      return NextResponse.json(
        { error: 'Failed to read file. Please try a different format (PDF or TXT recommended).' },
        { status: 400 }
      )
    }

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text content found in the uploaded file. Please check the file content.' },
        { status: 400 }
      )
    }

    // Limit text length to prevent timeouts
    const maxTextLength = 10000 // ~10k characters
    if (text.length > maxTextLength) {
      text = text.substring(0, maxTextLength)
      console.log(`Text truncated to ${maxTextLength} characters`)
    }

    try {
      const quiz = await Promise.race([
        generateQuizFromText(text, numQuestions),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout - please try again')), 60000)
        )
      ]) as { questions: Array<{ question: string; options: Array<{ id: string; label: string }>; correctAnswer: string; explanation: string }> }

      return NextResponse.json({
        success: true,
        quiz: quiz.questions,
        totalQuestions: quiz.questions.length,
        textLength: text.length,
      })
    } catch (aiError: unknown) {
      console.error('AI generation error:', aiError)

      const message = aiError instanceof Error ? aiError.message : 'Failed to generate quiz. Please try again.'

      // Check for specific OpenRouter errors
      if (message.includes('ECONNRESET')) {
        return NextResponse.json(
          { error: 'Connection timeout. Please try again.' },
          { status: 504 }
        )
      }

      return NextResponse.json(
        { error: message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}