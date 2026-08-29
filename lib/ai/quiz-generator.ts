import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import crypto from 'node:crypto'

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

const normalizeQuestion = (question: any, index: number): Question => ({
  id: String(question?.id || index + 1),
  question: String(question?.question || '').trim(),
  options: Array.isArray(question?.options)
    ? question.options.slice(0, 4).map((option: any) => ({
        id: String(option?.id || '').trim().toUpperCase(),
        label: String(option?.label || '').trim(),
      }))
    : [],
  correctAnswer: String(question?.correctAnswer || '').trim().toUpperCase(),
  explanation: String(question?.explanation || '').trim(),
  sourceReference: String(question?.sourceReference || '').trim(),
})

const isValidQuestion = (question: Question): boolean =>
  question.question.length >= 10 &&
  question.options.length === 4 &&
  ['A', 'B', 'C', 'D'].every((id) => question.options.some((option) => option.id === id && option.label)) &&
  ['A', 'B', 'C', 'D'].includes(question.correctAnswer) &&
  question.options.some((option) => option.id === question.correctAnswer) &&
  Boolean(question.explanation)

const validateQuiz = (value: unknown, minimumQuestions: number): GeneratedQuiz => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as GeneratedQuiz).questions)) {
    throw new Error('The AI returned an invalid quiz structure.')
  }

  const questions = (value as GeneratedQuiz).questions.map(normalizeQuestion).filter(isValidQuestion)

  if (questions.length < minimumQuestions) {
    throw new Error('The AI returned incomplete quiz questions. Please try again.')
  }

  return { questions }
}

const secureShuffle = <T,>(items: T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1)
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const randomizeQuestion = (question: Question, index: number): Question => {
  const shuffled = secureShuffle(question.options)
  const optionIds = ['A', 'B', 'C', 'D']
  const correctLabel = question.options.find((option) => option.id === question.correctAnswer)?.label

  if (!correctLabel) {
    return { ...question, id: String(index + 1) }
  }

  const options = shuffled.map((option, optionIndex) => ({
    id: optionIds[optionIndex],
    label: option.label,
  }))

  const correctIndex = options.findIndex((option) => option.label === correctLabel)

  return {
    ...question,
    id: String(index + 1),
    options,
    correctAnswer: optionIds[correctIndex],
  }
}

const createFreshQuiz = (pool: Question[], numQuestions: number): GeneratedQuiz => {
  const unique = new Map<string, Question>()

  for (const question of secureShuffle(pool)) {
    const key = question.question.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
    if (!unique.has(key)) unique.set(key, question)
  }

  const selected = secureShuffle([...unique.values()]).slice(0, numQuestions)

  return {
    questions: selected.map((question, index) => randomizeQuestion(question, index)),
  }
}

export async function generateQuizWithOpenRouter(text: string, numQuestions = 5, model = OPENROUTER_MODEL): Promise<GeneratedQuiz> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  }

  const documentText = buildStudyContext(text)
  const generationId = crypto.randomUUID()
  const documentFingerprint = crypto.createHash('sha256').update(documentText).digest('hex').slice(0, 16)
  const poolSize = Math.max(numQuestions * 3, 12)

  const prompt = `Generate a fresh question pool for a study quiz using ONLY the uploaded document.

REQUEST ID: ${generationId}
DOCUMENT INSTANCE: ${documentFingerprint}

Generate exactly ${poolSize} substantially different questions. The application will randomly choose ${numQuestions} questions from this pool after you respond.

FRESHNESS IS REQUIRED:
- This is a new quiz request, even if the same document was uploaded before.
- Do not produce a fixed or memorized set of questions.
- Do not focus only on the first or most obvious facts in the document.
- Cover different sections, concepts, facts, relationships, comparisons, details, and applications when supported.
- Use varied question wording and varied correct-answer positions.
- Do not repeat a question or create near-duplicate questions.
- The request ID and document instance are only uniqueness markers. Never ask questions about them.

GROUNDING:
- Use ONLY information contained in the uploaded document.
- Do not use outside knowledge.
- Every question must be answerable directly from the document.
- Every question must have exactly four options: A, B, C, D.
- Exactly one option must be correct.
- Explanations must be supported by the document.
- sourceReference must be a short quote or precise description of the supporting passage, maximum 220 characters.
- Do not invent page numbers, citations, facts, names, dates, or statistics.

Return JSON only in this shape:
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
      'Cache-Control': 'no-cache, no-store, max-age=0',
      Pragma: 'no-cache',
    },
    data: {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a strict document-grounded quiz generator. Return valid JSON only. Generate a diverse question pool for every request. Never reuse a fixed quiz. Use only the supplied document.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 1,
      top_p: 0.95,
      frequency_penalty: 0.35,
      presence_penalty: 0.25,
      max_tokens: Math.max(7000, poolSize * 650),
      response_format: { type: 'json_object' },
    },
  })

  const content = response.data.choices?.[0]?.message?.content
  if (!content) throw new Error('No content received from AI.')

  const pool = validateQuiz(JSON.parse(content), numQuestions).questions
  return createFreshQuiz(pool, numQuestions)
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL)
}
