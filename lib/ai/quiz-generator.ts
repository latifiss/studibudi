// lib/ai/quiz-generator.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim()
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000'
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'Studibudi'

export interface Question {
  id: string
  question: string
  options: {
    id: string
    label: string
  }[]
  correctAnswer: string
  explanation: string
}

export interface GeneratedQuiz {
  questions: Question[]
}

// Retry logic with exponential backoff
async function fetchWithRetry(
  url: string,
  options: AxiosRequestConfig,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<AxiosResponse> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios({
        url,
        ...options,
        timeout: 30000, // 30 second timeout
      })
      return response
    } catch (error: unknown) {
      lastError = error

      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        // Don't retry on certain errors
        if (status === 401 || status === 403) {
          throw new Error('Invalid API key. Please check your OpenRouter configuration.')
        }

        if (status === 402) {
          throw new Error('Insufficient balance. Please add credits to your OpenRouter account.')
        }

        // Only retry on network errors or 5xx errors
        if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || (typeof status === 'number' && status >= 500)) {
          if (attempt < maxRetries - 1) {
            const delay = initialDelay * Math.pow(2, attempt)
            console.log(`Retry ${attempt + 1}/${maxRetries} after ${delay}ms...`)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        }
      }

      throw error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('OpenRouter request failed')
}

export async function getAvailableModels(): Promise<Array<{ id: string; name: string; context_length: number; pricing: Record<string, unknown>; features?: string[] }>> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  }

  const response = await fetchWithRetry(
    'https://openrouter.ai/api/v1/models',
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
        'Content-Type': 'application/json',
      },
    }
  )

  return response.data.data || []
}

export async function generateQuizWithOpenRouter(
  text: string,
  numQuestions: number = 5,
  model: string = OPENROUTER_MODEL
): Promise<GeneratedQuiz> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  }

  // Truncate text if too long
  const truncatedText = text.length > 8000 ? text.substring(0, 8000) + '...' : text

  const prompt = `
You are an expert quiz generator for students. Create a multiple-choice quiz based on the following text.

Text: "${truncatedText}"

Generate ${numQuestions} multiple-choice questions with exactly 4 options each (A, B, C, D).
Each question must have one correct answer and a clear, helpful explanation.

Requirements:
1. Questions should test understanding, not just recall
2. Make questions challenging but fair
3. Explanations should teach why the correct answer is right and why others are wrong
4. Use clear, concise language suitable for students

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "What is the main topic of the text?",
      "options": [
        { "id": "A", "label": "Option 1" },
        { "id": "B", "label": "Option 2" },
        { "id": "C", "label": "Option 3" },
        { "id": "D", "label": "Option 4" }
      ],
      "correctAnswer": "A",
      "explanation": "The text clearly states that..."
    }
  ]
}
`

  try {
    const response = await fetchWithRetry(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': OPENROUTER_SITE_URL,
          'X-Title': OPENROUTER_SITE_NAME,
          'Content-Type': 'application/json',
        },
        data: {
          model: model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert quiz generator. Always return valid JSON. Never include any other text outside the JSON.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 2000,
          response_format: { type: 'json_object' },
        },
      }
    )

    const content = response.data.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from AI')
    }

    // Try to parse JSON response
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      // Sometimes the AI returns JSON with markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        throw new Error('Failed to parse AI response')
      }
    }

    return parsed as GeneratedQuiz
  } catch (error) {
    console.error('OpenRouter error:', error)
    if (axios.isAxiosError(error)) {
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`)
    }
    throw error
  }
}

export async function generateQuizFromText(
  text: string,
  numQuestions: number = 5,
  model?: string
): Promise<GeneratedQuiz> {
  const selectedModel = model || OPENROUTER_MODEL
  return generateQuizWithOpenRouter(text, numQuestions, selectedModel)
}