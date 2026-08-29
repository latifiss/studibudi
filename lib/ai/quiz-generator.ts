import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import crypto from 'node:crypto'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim()
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000'
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'Studibudi'

export interface Question { id: string; question: string; options: { id: string; label: string }[]; correctAnswer: string; explanation: string; sourceReference?: string }
export interface GeneratedQuiz { questions: Question[] }

async function fetchWithRetry(url: string, options: AxiosRequestConfig, maxRetries = 3): Promise<AxiosResponse> {
  let lastError: unknown
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try { return await axios({ url, ...options, timeout: 55000 }) }
    catch (error: unknown) {
      lastError = error
      if (axios.isAxiosError(error)) {
        const status = error.response?.status
        if (status === 401 || status === 403) throw new Error('Invalid API key. Please check your OpenRouter configuration.')
        if (status === 402) throw new Error('Insufficient OpenRouter balance. Please add credits and try again.')
        const retryable = status === 408 || status === 429 || (status !== undefined && status >= 500) || ['ECONNRESET', 'ETIMEDOUT', 'ECONNABORTED'].includes(error.code || '')
        if (retryable && attempt < maxRetries - 1) { await new Promise(r => setTimeout(r, 1500 * 2 ** attempt)); continue }
        throw new Error(error.response?.data?.error?.message || error.message)
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

const normalizeQuestionText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const questionFingerprint = (question: Question | string) => crypto.createHash('sha256').update(normalizeQuestionText(typeof question === 'string' ? question : question.question)).digest('hex')

const normalizeOptionId = (id: unknown, index: number): string => {
  const value = String(id ?? '').trim().toUpperCase()
  const numericMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' }
  return numericMap[value] || value || ['A', 'B', 'C', 'D'][index] || ''
}

const normalizeQuestion = (question: any, index: number): Question => {
  const rawOptions = Array.isArray(question?.options) ? question.options : []
  const options = rawOptions.slice(0, 4).map((option: any, optionIndex: number) => typeof option === 'string'
    ? { id: ['A', 'B', 'C', 'D'][optionIndex], label: option.trim() }
    : { id: normalizeOptionId(option?.id, optionIndex), label: String(option?.label ?? option?.text ?? '').trim() })
  const correctRaw = String(question?.correctAnswer ?? question?.answer ?? '').trim().toUpperCase()
  const numericCorrectMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'OPTION 1': 'A', 'OPTION 2': 'B', 'OPTION 3': 'C', 'OPTION 4': 'D' }
  let correctAnswer = numericCorrectMap[correctRaw] || correctRaw
  if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
    const matchingIndex = options.findIndex(option => option.label.toUpperCase() === correctRaw)
    if (matchingIndex >= 0) correctAnswer = ['A', 'B', 'C', 'D'][matchingIndex]
  }
  const explanation = String(question?.explanation || question?.rationale || '').trim()
  const sourceReference = String(question?.sourceReference || '').trim()
  return { id: String(question?.id || index + 1), question: String(question?.question || question?.prompt || '').trim(), options, correctAnswer, explanation: explanation || sourceReference || 'The correct answer is supported by the uploaded document.', sourceReference }
}

const isValidQuestion = (question: Question): boolean => {
  const optionIds = question.options.map(option => option.id)
  return question.question.length >= 10 && question.options.length === 4 && new Set(optionIds).size === 4 &&
    ['A', 'B', 'C', 'D'].every(id => question.options.some(option => option.id === id && option.label.length > 0)) &&
    ['A', 'B', 'C', 'D'].includes(question.correctAnswer) && question.options.some(option => option.id === question.correctAnswer && option.label.length > 0) && question.explanation.length > 0
}

const validateQuiz = (value: unknown, minimumQuestions: number): GeneratedQuiz => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as GeneratedQuiz).questions)) throw new Error('The AI returned an invalid quiz structure.')
  const questions = (value as GeneratedQuiz).questions.map(normalizeQuestion).filter(isValidQuestion)
  if (questions.length < minimumQuestions) throw new Error(`The AI returned only ${questions.length} usable questions. Please try again.`)
  return { questions }
}

const secureShuffle = <T,>(items: T[]): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [result[i], result[j]] = [result[j], result[i]] }
  return result
}

const randomizeQuestion = (question: Question, index: number): Question => {
  const shuffled = secureShuffle(question.options)
  const optionIds = ['A', 'B', 'C', 'D']
  const correctLabel = question.options.find(option => option.id === question.correctAnswer)?.label
  if (!correctLabel) return { ...question, id: String(index + 1) }
  const options = shuffled.map((option, optionIndex) => ({ id: optionIds[optionIndex], label: option.label }))
  const correctIndex = options.findIndex(option => option.label === correctLabel)
  return { ...question, id: String(index + 1), options, correctAnswer: optionIds[correctIndex] }
}

const createFreshQuiz = (pool: Question[], numQuestions: number, excludedQuestionFingerprints = new Set<string>()): GeneratedQuiz => {
  const unique = new Map<string, Question>()
  for (const question of secureShuffle(pool)) {
    const fingerprint = questionFingerprint(question)
    if (!excludedQuestionFingerprints.has(fingerprint) && !unique.has(fingerprint)) unique.set(fingerprint, question)
  }
  const selected = secureShuffle([...unique.values()]).slice(0, numQuestions)
  if (selected.length < numQuestions) throw new Error(`Not enough new questions were generated. Needed ${numQuestions}, found ${selected.length}.`)
  return { questions: selected.map((question, index) => randomizeQuestion(question, index)) }
}

async function requestQuizPool(prompt: string, model: string, poolSize: number, generationId: string): Promise<unknown> {
  const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'HTTP-Referer': OPENROUTER_SITE_URL, 'X-Title': OPENROUTER_SITE_NAME, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    data: {
      model,
      messages: [
        { role: 'system', content: 'You are a strict document-grounded quiz generator. Return valid JSON only. Generate a diverse question pool for every request. Use only the supplied document.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1, top_p: 0.95, frequency_penalty: 0.35, presence_penalty: 0.25,
      max_tokens: Math.max(9000, poolSize * 700), response_format: { type: 'json_object' },
    },
  })
  const content = response.data.choices?.[0]?.message?.content
  if (!content) throw new Error(`No content received from AI for generation ${generationId}.`)
  return JSON.parse(content)
}

export async function generateQuizWithOpenRouter(text: string, numQuestions = 5, model = OPENROUTER_MODEL, previousQuestions: string[] = []): Promise<GeneratedQuiz> {
  if (!OPENROUTER_API_KEY) throw new Error('OpenRouter API key is missing. Add OPENROUTER_API_KEY to your environment variables.')
  const documentText = buildStudyContext(text)
  const generationId = crypto.randomUUID()
  const documentFingerprint = crypto.createHash('sha256').update(documentText).digest('hex').slice(0, 16)
  const previousQuestionFingerprints = new Set(previousQuestions.map(questionFingerprint))
  const poolSize = Math.max(numQuestions * 3, 15)

  const buildPrompt = (requestedPoolSize: number, retry = false) => {
    const excluded = previousQuestions.length > 0
      ? `\n\nQUESTIONS ALREADY USED\nDo NOT reuse or closely paraphrase these questions. Create different questions testing different aspects of the document:\n${previousQuestions.slice(0, 100).map((q, i) => `${i + 1}. ${q}`).join('\n')}\nEND USED QUESTIONS\n`
      : ''
    return `Generate a fresh question pool for a study quiz using ONLY the uploaded document.\n\nREQUEST ID: ${generationId}-${retry ? 'retry' : 'initial'}\nDOCUMENT INSTANCE: ${documentFingerprint}\n\nGenerate exactly ${requestedPoolSize} substantially different questions. The application will randomly choose ${numQuestions} NEW questions from this pool.\n\nFRESHNESS IS REQUIRED:\n- This is a completely new quiz generation request.\n- Every generated quiz must be different from all quizzes previously generated for this user.\n- Never reuse an earlier question, even when the exact same document is uploaded again.\n- Do not merely change wording of a previously used question; test a different fact, relationship, section, comparison, implication, or application.\n- Cover different sections, concepts, facts, relationships, comparisons, details, and applications when supported.\n- Use varied wording and correct-answer positions.\n- Do not repeat or create near-duplicate questions.\n${excluded}\nGROUNDING:\n- Use ONLY information contained in the uploaded document.\n- Do not use outside knowledge.\n- Every question must be answerable directly from the document.\n- Every question must have exactly four options: A, B, C, D.\n- Exactly one option must be correct.\n- Every question must include a concise explanation.\n- sourceReference is optional and must not be invented.\n\nReturn JSON only with {"questions":[{"id":"1","question":"...","options":[{"id":"A","label":"..."},{"id":"B","label":"..."},{"id":"C","label":"..."},{"id":"D","label":"..."}],"correctAnswer":"A","explanation":"...","sourceReference":"..."}]}\n\nUPLOADED DOCUMENT\n${documentText}\nEND DOCUMENT`
  }

  let lastValidationError: Error | null = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const requestedPoolSize = attempt === 0 ? poolSize : Math.max(numQuestions * 4, 20)
      const value = await requestQuizPool(buildPrompt(requestedPoolSize, attempt > 0), model, requestedPoolSize, generationId)
      const pool = validateQuiz(value, numQuestions).questions
      return createFreshQuiz(pool, numQuestions, previousQuestionFingerprints)
    } catch (error) {
      lastValidationError = error instanceof Error ? error : new Error('Quiz generation failed.')
      if (attempt < 2) continue
      throw lastValidationError
    }
  }
  throw lastValidationError || new Error('Quiz generation failed.')
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string, previousQuestions: string[] = []): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL, previousQuestions)
}
