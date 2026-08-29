import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import crypto from 'node:crypto'

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY?.trim()
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini'
const OPENROUTER_SITE_URL = process.env.OPENROUTER_SITE_URL || 'http://localhost:3000'
const OPENROUTER_SITE_NAME = process.env.OPENROUTER_SITE_NAME || 'Studibudi'

export interface Question { id: string; question: string; options: { id: string; label: string }[]; correctAnswer: string; explanation: string; sourceReference?: string }
export interface GeneratedQuiz { questions: Question[]; title: string }

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

const normalizeQuestionText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\b(what|which|who|where|when|why|how|does|did|is|are|was|were|can|could|the|a|an|of|to|in|on|for|from|and|or|with|by|as|about|according|document)\b/g, ' ').replace(/\s+/g, ' ').trim()
const questionFingerprint = (question: Question | string) => crypto.createHash('sha256').update(normalizeQuestionText(typeof question === 'string' ? question : question.question)).digest('hex')

const questionTokens = (value: string) => new Set(normalizeQuestionText(value).split(' ').filter(token => token.length > 2))

// Detect questions that are effectively the same even when the model paraphrases them.
const questionSimilarity = (a: string, b: string) => {
  const left = questionTokens(a)
  const right = questionTokens(b)
  if (!left.size || !right.size) return 0
  let intersection = 0
  for (const token of left) if (right.has(token)) intersection++
  return intersection / (left.size + right.size - intersection)
}

const isNearDuplicate = (question: string, previousQuestions: string[]) => {
  const normalized = normalizeQuestionText(question)
  if (!normalized) return true
  return previousQuestions.some(previous => {
    if (questionFingerprint(question) === questionFingerprint(previous)) return true
    const similarity = questionSimilarity(question, previous)
    return similarity >= 0.72
  })
}

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

const cleanTitle = (value: unknown): string => {
  const title = String(value ?? '').replace(/[\n"'`]/g, '').replace(/\s+/g, ' ').trim()
  return (title || 'Study Session').slice(0, 70)
}

const validateQuiz = (value: unknown, minimumQuestions: number): GeneratedQuiz => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as GeneratedQuiz).questions)) throw new Error('The AI returned an invalid quiz structure.')
  const questions = (value as GeneratedQuiz).questions.map(normalizeQuestion).filter(isValidQuestion)
  if (questions.length < minimumQuestions) throw new Error(`The AI returned only ${questions.length} usable questions. Please try again.`)
  return { questions, title: cleanTitle((value as { title?: unknown }).title) }
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

const createFreshQuiz = (pool: Question[], numQuestions: number, previousQuestions: string[], title: string): GeneratedQuiz => {
  const unique: Question[] = []
  const seenFingerprints = new Set<string>()

  for (const question of secureShuffle(pool)) {
    const fingerprint = questionFingerprint(question)
    if (seenFingerprints.has(fingerprint)) continue
    if (isNearDuplicate(question.question, previousQuestions)) continue
    if (unique.some(existing => questionSimilarity(existing.question, question.question) >= 0.72)) continue
    seenFingerprints.add(fingerprint)
    unique.push(question)
  }

  const selected = secureShuffle(unique).slice(0, numQuestions)
  if (selected.length < numQuestions) throw new Error(`Not enough genuinely new questions were generated. Needed ${numQuestions}, found ${selected.length}.`)

  return { questions: selected.map((question, index) => randomizeQuestion(question, index)), title: cleanTitle(title) }
}

async function requestQuizPool(prompt: string, model: string, poolSize: number, generationId: string): Promise<unknown> {
  const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'HTTP-Referer': OPENROUTER_SITE_URL, 'X-Title': OPENROUTER_SITE_NAME, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    data: {
      model,
      messages: [
        { role: 'system', content: 'You are a strict document-grounded quiz generator. Return valid JSON only. Generate a genuinely different question pool for every request. Never repeat or paraphrase previously used questions. Use only the supplied document.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1.2,
      top_p: 1,
      frequency_penalty: 0.7,
      presence_penalty: 0.6,
      max_tokens: Math.max(10000, poolSize * 750),
      response_format: { type: 'json_object' },
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
  const poolSize = Math.max(numQuestions * 4, 20)
  const previousForPrompt = previousQuestions.slice(0, 150)

  const buildPrompt = (requestedPoolSize: number, retry: number) => {
    const excluded = previousForPrompt.length > 0
      ? `\n\nPREVIOUSLY USED QUESTIONS — ABSOLUTELY EXCLUDE THESE\nThese questions were already shown to this user. You must create different questions. Do not ask the same thing with different wording. Do not simply swap the options. Test different information from the document.\n${previousForPrompt.map((q, i) => `${i + 1}. ${q}`).join('\n')}\nEND PREVIOUSLY USED QUESTIONS\n`
      : ''

    return `Create a NEW study quiz from the uploaded document.\n\nGENERATION ID: ${generationId}\nATTEMPT: ${retry + 1}\nDOCUMENT INSTANCE: ${documentFingerprint}\n\nGenerate exactly ${requestedPoolSize} candidate questions. The application will select ${numQuestions} questions only after checking them against every previous quiz.\n\nThe new quiz must be meaningfully different from every earlier quiz, including when the exact same document is uploaded again. Prioritize different sections, facts, relationships, examples, definitions, comparisons, processes, consequences, and applications. Never recycle the same core fact as an earlier question.\n\nGenerate one short natural title describing the document's main subject. Make it 2-5 words, like an AI chat title. Do not use the filename, date, or the word Quiz.\n${excluded}\n\nRULES:\n- Use ONLY the uploaded document.\n- Exactly four options per question: A, B, C, D.\n- Exactly one correct answer.\n- Include a concise explanation.\n- Do not invent facts or citations.\n- Do not repeat or closely paraphrase any previous question.\n- Do not generate a pool where several questions test the same fact.\n\nReturn JSON only:\n{"title":"Natural Subject Title","questions":[{"id":"1","question":"...","options":[{"id":"A","label":"..."},{"id":"B","label":"..."},{"id":"C","label":"..."},{"id":"D","label":"..."}],"correctAnswer":"A","explanation":"..."}]}\n\nUPLOADED DOCUMENT\n${documentText}\nEND DOCUMENT`
  }

  let lastError: Error | null = null
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const requestedPoolSize = attempt === 0 ? poolSize : Math.max(numQuestions * 5, 25)
      const value = await requestQuizPool(buildPrompt(requestedPoolSize, attempt), model, requestedPoolSize, generationId)
      const validated = validateQuiz(value, numQuestions)
      return createFreshQuiz(validated.questions, numQuestions, previousQuestions, validated.title)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Quiz generation failed.')
      if (attempt === 3) throw lastError
    }
  }
  throw lastError || new Error('Quiz generation failed.')
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string, previousQuestions: string[] = []): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL, previousQuestions)
}
