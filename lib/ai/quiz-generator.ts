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

const normalizeQuestionText = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim()
const questionFingerprint = (question: Question | string) => crypto.createHash('sha256').update(normalizeQuestionText(typeof question === 'string' ? question : question.question)).digest('hex')

// History is exclusion data only. Do not use semantic similarity here: a legitimate
// paraphrase or a new question about the same concept is allowed.
const isExactDuplicate = (question: string, previousQuestions: string[]) => {
  const normalized = normalizeQuestionText(question)
  return previousQuestions.some(previous => normalized === normalizeQuestionText(previous))
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

const extractQuestions = (value: unknown): { questions: Question[]; title: string } => {
  if (!value || typeof value !== 'object' || !Array.isArray((value as any).questions)) return { questions: [], title: cleanTitle((value as any)?.title) }
  return { questions: (value as any).questions.map(normalizeQuestion).filter(isValidQuestion), title: cleanTitle((value as any).title) }
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

const selectFreshQuestions = (candidates: Question[], numQuestions: number, previousQuestions: string[]) => {
  const selected: Question[] = []
  const seen = new Set<string>()
  for (const question of secureShuffle(candidates)) {
    const fingerprint = questionFingerprint(question)
    if (seen.has(fingerprint)) continue
    if (isExactDuplicate(question.question, previousQuestions)) continue
    if (selected.some(existing => questionFingerprint(existing) === fingerprint)) continue
    seen.add(fingerprint)
    selected.push(question)
    if (selected.length === numQuestions) break
  }
  return selected
}

async function requestQuiz(prompt: string, model: string, generationId: string, maxTokens = 10000): Promise<unknown> {
  const response = await fetchWithRetry('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENROUTER_API_KEY}`, 'HTTP-Referer': OPENROUTER_SITE_URL, 'X-Title': OPENROUTER_SITE_NAME, 'Content-Type': 'application/json', 'Cache-Control': 'no-cache, no-store, max-age=0', Pragma: 'no-cache' },
    data: {
      model,
      messages: [
        { role: 'system', content: 'You are a document-grounded quiz generator. The CURRENT DOCUMENT is the only source of facts. Previous questions are provided only as a do-not-repeat list; they are NOT source material and must never be used to introduce facts. Return valid JSON only. Always produce the requested number of complete usable questions.' },
        { role: 'user', content: prompt },
      ],
      temperature: 1.2, top_p: 1, frequency_penalty: 0.7, presence_penalty: 0.6,
      max_tokens: maxTokens, response_format: { type: 'json_object' },
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
  const previousForPrompt = previousQuestions.slice(0, 150)

  const makePrompt = (count: number, existing: Question[] = []) => {
    const previousBlock = previousForPrompt.length
      ? `\n\nDO-NOT-REPEAT LIST (EXCLUSION ONLY)\nThese are questions used in earlier quizzes. They are NOT part of the source material. Do not copy them. You may ask a different question about the same subject if that subject is supported by the current document.\n${previousForPrompt.map((q, i) => `${i + 1}. ${q}`).join('\n')}\nEND EXCLUSION LIST\n`
      : ''
    const existingBlock = existing.length
      ? `\n\nALREADY ACCEPTED QUESTIONS FOR THIS QUIZ\nDo not repeat these exact questions:\n${existing.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}\nEND ACCEPTED QUESTIONS\n`
      : ''
    return `Generate exactly ${count} fresh quiz question${count === 1 ? '' : 's'} from the CURRENT DOCUMENT below.\n\nGENERATION ID: ${generationId}\nDOCUMENT INSTANCE: ${documentFingerprint}\n\nSOURCE RULE — CRITICAL:\n- The CURRENT DOCUMENT below is the ONLY knowledge source.\n- Every question, every option, the correct answer, and every explanation must be supported by information in the CURRENT DOCUMENT.\n- Do not use outside knowledge.\n- Do not use facts from previous questions. Previous questions are exclusion data only.\n- If a fact is not in the CURRENT DOCUMENT, do not include it.\n\nUNIQUENESS:\n- Never copy a previous question verbatim.\n- Do not make a trivial word swap of a previous question.\n- Legitimate paraphrasing and different questions about the same concept are allowed.\n- Reusing answer choices is allowed when they are supported by the CURRENT DOCUMENT.\n- Vary question type and perspective when the document supports it.\n\nQUESTION FORMAT:\n- Exactly four options: A, B, C, D.\n- Exactly one correct answer.\n- Concise explanation grounded in the CURRENT DOCUMENT.\n- No placeholders.\n\n${previousBlock}${existingBlock}\nReturn JSON only:\n{"title":"Natural Subject Title","questions":[{"id":"1","question":"...","options":[{"id":"A","label":"..."},{"id":"B","label":"..."},{"id":"C","label":"..."},{"id":"D","label":"..."}],"correctAnswer":"A","explanation":"..."}]}\n\nTitle: 2-5 words describing the CURRENT DOCUMENT's main subject. Do not use the filename, date, or the word Quiz.\n\n=== CURRENT DOCUMENT — ONLY SOURCE ===\n${documentText}\n=== END CURRENT DOCUMENT ===`
  }

  let accepted: Question[] = []
  let title = 'Study Session'
  let lastError: Error | null = null

  for (let attempt = 0; attempt < 6 && accepted.length < numQuestions; attempt++) {
    try {
      const missing = numQuestions - accepted.length
      const requested = attempt === 0 ? numQuestions : Math.max(missing + 2, missing)
      const value = await requestQuiz(makePrompt(requested, accepted), model, generationId, Math.max(10000, requested * 800))
      const extracted = extractQuestions(value)
      if (extracted.title !== 'Study Session') title = extracted.title
      const fresh = selectFreshQuestions(extracted.questions, missing, [...previousForPrompt, ...accepted.map(q => q.question)])
      accepted = [...accepted, ...fresh]
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Quiz generation failed.')
    }
  }

  if (accepted.length < numQuestions) throw lastError || new Error(`The AI could not produce ${numQuestions} complete questions. Please try again.`)
  return { questions: accepted.slice(0, numQuestions).map((question, index) => randomizeQuestion(question, index)), title: cleanTitle(title) }
}

export async function generateQuizFromText(text: string, numQuestions = 5, model?: string, previousQuestions: string[] = []): Promise<GeneratedQuiz> {
  return generateQuizWithOpenRouter(text, numQuestions, model || OPENROUTER_MODEL, previousQuestions)
}
