import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim()
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000'
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'Studibudi'

export interface Question {
  id: string
  question: string
  options: { id: string; label: string }[]
  correctAnswer: string
  explanation: string
  sourceReference?: string
}

export interface GeneratedQuiz {
  questions: Question[]
}

async function fetchWithRetry(url: string, options: AxiosRequestConfig, maxRetries = 3): Promise<AxiosResponse> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await axios({ url, ...options, timeout: 55000 })
    } catch (error: unknown) {
      lastError = error
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 401 || status === 403) throw new Error('Invalid API key. Please check your OpenRouter configuration.')
        if (status === 402) throw new Error('Insufficient OpenRouter balance. Please add credits and try again.')
        const retryable = status === 408 || status === 429 || (status !== undefined && status >= 500) || ['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED'].includes(error.code || '')
        if (retryable && attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500 * 2 ** attempt))
          continue
        }
        const providerMessage = error.response?.data?.error?.message
        throw new Error(providerMessage || error.message)
      }
      throw error
    }
  }
  throw lastError instanceof Error ? lastError : new Error('OpenRouter request failed')
}

const createChunks = (text: string, size = 12000, overlap = 1000) => {
  const normalized = text.replace(/\s+/g, ' ').trim()
  if (!normalized) return []
  const chunks: string[] = []
  let start = 0
  while (start < normalized.length) {
    const end = Math.min(normalized.length, start + size)
    chunks.push(normalized.slice(start, end))
    if (end >= normalized.length) break
    start = end - overlap
  }
  return chunks
}

const buildStudyContext = (text: string, maxCharacters = 50000) => {
  const chunks = createChunks(text)
  if (text.length <= maxCharacters) return text.trim()
  const selected: string[] = []
  const count = Math.min(chunks.length, Math.max(4, Math.floor(maxCharacters / 11000)))
  for (let i = 0; i < count; i++) {
    const index = Math.floor((i * (chunks.length - 1)) / Math.max(1, count - 1))
    selected.push(`[SECTION ${i + 1}]\n${chunks[index]}`)
  }
  return selected.join('\n\n')
}

const validateQuiz = (value: unknown, expectedQuestions: number): GeneratedQuiz => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as GeneratedQuiz).questions)) {
    throw new Error('The AI returned an invalid quiz structure.')
  }
  const questions = (value as GeneratedQuiz).questions.slice(0, expectedQuestions).map((question, index) => ({
    id: String(question.id || index + 1),
    question: String(question.question || '').trim(),
    options: Array.isArray(question.options) ? question.options.slice(0, 4).map((option) => ({ id: String(option?.id || '').trim().toUpperCase(), label: String(option?.label || '').trim() })) : [],
    correctAnswer: String(question.correctAnswer || '').trim().toUpperCase(),
    explanation: String(question.explanation || '').trim(),
    sourceReference: String(question.sourceReference || '').trim(),
  }))
  if (questions.length !== expectedQuestions || questions.some((question) => question.question.length < 10 || question.options.length !== 4 || question.options.some((option) => !option.id || !option.label) || !['A', 'B', 'C', 'D'].every((id) => question.options.some((option) => option.id === id)) || !question.options.some((option) => option.id === question.correctAnswer) || !question.explanation)) {
    throw new Error('The AI returned incomplete quiz questions. Please try again.')
  }
  return { questions }
}

export async function generateQuizWithOpenRouter(text: string, numQuestions = 5, model = OPENROUTER_MODEL): Promise<GeneratedQuiz> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  const documentText = buildStudyContext(text)
  const prompt = `Create a study quiz using ONLY the uploaded document below.

Rules:
- Every question must be answerable from the document.
- Do not use general knowledge or information not present in the document.
- Create exactly ${numQuestions} multiple-choice questions.
- Every question must have exactly four options with IDs A, B, C, D.
- Exactly one option must be correct.
- Questions should cover different parts of the document where possible.
- Explanations must explain the answer using facts from the document.
- sourceReference must identify the supporting passage in a short quote or precise description, maximum 220 characters.
- Never invent citations, page numbers, facts, names, dates, or statistics.

Return JSON only in this exact shape:
{
  "questions": [
    {
      "id": "1",
      "question": "...",
      "options": [
        {"id":"A","label":"..."},
        {"id":"B","label":"..."},
        {"id":"C","label":"..."},
        {"id":"D","label":"..."}
      ],
      "correctAnswer":"A",
      "explanation":"...",
      "sourceReference":"..."
    }
  ]
}

UPLOADED DOCUMENT
${documentText}
END DOCUMENT`

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
        { role: 'system', content: 'You are a strict document-grounded quiz generator. Return valid JSON only. Never invent information outside the supplied document.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 5000,
      response_format: { type: 'json_object' },
    },
  })

  const content = response.data.choices?.[0]?.message?.content
  if (!content) throw new Error('No content received from AI.')
  return validateQuiz(JSON.parse(content), numQuestions)
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL)
}
