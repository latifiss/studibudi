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
  sourceReference?: string
}

export interface GeneratedQuiz {
  questions: Question[]
}

async function fetchWithRetry(
  url: string,
  options: AxiosRequestConfig,
  maxRetries = 3,
  initialDelay = 1000
): Promise<AxiosResponse> {
  let lastError: unknown

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios({ url, ...options, timeout: 55000 })
    } catch (error: unknown) {
      lastError = error

      if (axios.isAxiosError(error)) {
        const status = error.response?.status

        if (status === 401 || status === 403) {
          throw new Error('Invalid API key. Please check your OpenRouter configuration.')
        }

        if (status === 402) {
          throw new Error('Insufficient OpenRouter balance. Please add credits and try again.')
        }

        if (attempt < maxRetries - 1 && (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED' || (status && status >= 500))) {
          await new Promise((resolve) => setTimeout(resolve, initialDelay * 2 ** attempt))
          continue
        }
      }

      throw error
    }
  }

  throw lastError instanceof Error ? lastError : new Error('OpenRouter request failed')
}

const buildDocumentExcerpt = (text: string, maxCharacters = 48000) => {
  const normalized = text.trim()

  if (normalized.length <= maxCharacters) return normalized

  const slices = 8
  const sliceSize = Math.floor(maxCharacters / slices)
  const step = Math.floor((normalized.length - sliceSize) / (slices - 1))
  const excerpt: string[] = []

  for (let index = 0; index < slices; index++) {
    const start = Math.max(0, Math.min(normalized.length - sliceSize, index * step))
    excerpt.push(normalized.slice(start, start + sliceSize))
  }

  return excerpt.join('\n\n[...document continues...]\n\n')
}

const validateQuiz = (value: unknown, expectedQuestions: number): GeneratedQuiz => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as GeneratedQuiz).questions)) {
    throw new Error('The AI returned an invalid quiz structure.')
  }

  const questions = (value as GeneratedQuiz).questions
    .slice(0, expectedQuestions)
    .map((question, index) => ({
      id: String(question.id || index + 1),
      question: String(question.question || '').trim(),
      options: Array.isArray(question.options)
        ? question.options.slice(0, 4).map((option) => ({
            id: String(option.id || '').trim(),
            label: String(option.label || '').trim(),
          }))
        : [],
      correctAnswer: String(question.correctAnswer || '').trim(),
      explanation: String(question.explanation || '').trim(),
      sourceReference: String(question.sourceReference || '').trim(),
    }))

  if (questions.length !== expectedQuestions || questions.some((question) => !question.question || question.options.length !== 4 || !question.correctAnswer || !question.explanation || !question.options.some((option) => option.id === question.correctAnswer))) {
    throw new Error('The AI returned incomplete quiz questions. Please try again.')
  }

  return { questions }
}

export async function generateQuizWithOpenRouter(
  text: string,
  numQuestions = 5,
  model = OPENROUTER_MODEL
): Promise<GeneratedQuiz> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  }

  const documentText = buildDocumentExcerpt(text)

  const prompt = `You generate study quizzes from uploaded documents.

Your only source of truth is the DOCUMENT below. Do not use outside knowledge to create facts, answers, or explanations. Every question, correct answer, and explanation must be directly supported by the document.

Create exactly ${numQuestions} multiple-choice questions with exactly four options A, B, C, and D. Spread the questions across different sections or topics when the document contains multiple sections.

For each question:
- Test understanding of the uploaded document, not generic trivia.
- Include one and only one correct answer.
- Make all distractors plausible but clearly incorrect according to the document.
- In the explanation, explain why the correct answer is correct and why the other choices are wrong using the document.
- Include sourceReference as a short quote or precise reference to the supporting passage, maximum 220 characters.
- Never mention information that is not in the document.
- If the document does not contain enough reliable material, return fewer questions only when absolutely necessary and explain this in the JSON error field.

Return JSON only:
{
  "questions": [
    {
      "id": "1",
      "question": "...",
      "options": [
        { "id": "A", "label": "..." },
        { "id": "B", "label": "..." },
        { "id": "C", "label": "..." },
        { "id": "D", "label": "..." }
      ],
      "correctAnswer": "A",
      "explanation": "...",
      "sourceReference": "..."
    }
  ]
}

DOCUMENT START
${documentText}
DOCUMENT END`

  try {
    const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': OPENROUTER_SITE_URL,
        'X-Title': OPENROUTER_SITE_NAME,
        'Content-Type': 'application/json',
      },
      data: {
        model,
        messages: [
          {
            role: 'system',
            content: 'You are a strict document-grounded quiz generator. Return valid JSON only. Never invent facts outside the supplied document.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      },
    })

    const content = response.data.choices?.[0]?.message?.content
    if (!content) throw new Error('No content received from AI.')

    const parsed = JSON.parse(content)
    return validateQuiz(parsed, numQuestions)
  } catch (error) {
    console.error('OpenRouter error:', error)

    if (axios.isAxiosError(error)) {
      throw new Error(`OpenRouter API error: ${error.response?.data?.error?.message || error.message}`)
    }

    throw error
  }
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL)
}
