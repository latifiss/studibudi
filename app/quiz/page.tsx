'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { CloseIcon } from '@/public/icons/mono'
import Progress from '@/components/ui/progress'
import QuizSelection from '@/components/ui/quizSelection'
import Notice from '@/components/ui/notice'
import Finish from '@/components/ui/finish'
import Explanation from '@/components/ui/explanation'

interface Question { id: number; question: string; options: { id: string; label: string }[]; correctAnswer: string; explanation: string; sourceReference?: string }

const normalizeQuizData = (raw: unknown): Question[] => {
  if (!Array.isArray(raw)) return []
  return raw.map((item: any, index) => {
    const options = Array.isArray(item?.options) ? item.options.map((option: any) => ({ id: String(option?.id ?? '').toUpperCase(), label: String(option?.label ?? '') })).filter((option: any) => option.id && option.label) : []
    return { id: Number(item?.id) || index + 1, question: String(item?.question ?? '').trim(), options, correctAnswer: String(item?.correctAnswer ?? item?.answer ?? '').toUpperCase(), explanation: String(item?.explanation ?? '').trim(), sourceReference: String(item?.sourceReference ?? '').trim() }
  }).filter((item) => item.question && item.options.length === 4 && item.options.every((option) => ['A', 'B', 'C', 'D'].includes(option.id)) && ['A', 'B', 'C', 'D'].includes(item.correctAnswer) && item.explanation)
}

const Quiz = () => {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const startSoundRef = useRef<HTMLAudioElement | null>(null)
  const completeSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => { const loadQuiz = async () => { try { const params = new URLSearchParams(window.location.search); const historyId = params.get('historyId'); let raw: unknown; if (historyId) { const response = await fetch(`/api/quizzes/${historyId}`); if (!response.ok) throw new Error('Unable to load this quiz.'); const data = await response.json(); raw = data?.quiz?.questions } else { const stored = localStorage.getItem('currentQuiz'); if (!stored) throw new Error('No generated quiz was found. Please upload a file first.'); raw = JSON.parse(stored) } const normalized = normalizeQuizData(raw); if (!normalized.length) throw new Error('This quiz does not contain valid generated questions.'); setQuestions(normalized) } catch (error) { console.error('Failed to load quiz:', error); setLoadError(error instanceof Error ? error.message : 'Failed to load quiz.') } }; loadQuiz() }, [])
  useEffect(() => { const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile) }, [])
  useEffect(() => { if (!questions.length) return; let correctCount = 0; questions.forEach((question) => { if (answers[question.id] === question.correctAnswer) correctCount++ }); setScore(correctCount) }, [answers, questions])
  useEffect(() => { startSoundRef.current = new Audio('/sounds/start.mp3'); completeSoundRef.current = new Audio('/sounds/complete.mp3'); startSoundRef.current.load(); completeSoundRef.current.load(); startSoundRef.current.play().catch(() => {}); return () => { startSoundRef.current?.pause(); completeSoundRef.current?.pause(); startSoundRef.current = null; completeSoundRef.current = null } }, [])
  useEffect(() => { if (!questions.length || isComplete) return; setShowFeedback(false); setIsAnswerCorrect(false); setShowExplanation(false); setSelectedOption(answers[questions[currentQuestionIndex].id] || null) }, [currentQuestionIndex, questions, isComplete])

  if (loadError) return <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-white px-6 text-center"><div className="max-w-md"><h1 className="font-display text-2xl font-bold text-[#333333]">Unable to load quiz</h1><p className="mt-3 font-text text-sm text-[#737373]">{loadError}</p><button onClick={() => router.push('/dashboard')} className="mt-6 rounded-lg bg-[#4F4CF0] px-5 py-3 font-text text-sm font-bold text-white">Back to Dashboard</button></div></div>
  if (!questions.length) return <div className="flex h-dvh w-full items-center justify-center overflow-hidden bg-white font-text text-sm text-[#737373]">Loading quiz...</div>

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const hasSelectedOption = selectedOption !== null
  const handleOptionToggle = (optionId: string) => { if (showFeedback) return; const next = selectedOption === optionId ? null : optionId; setSelectedOption(next); if (next) setAnswers((previous) => ({ ...previous, [currentQuestion.id]: next })); else setAnswers((previous) => { const nextAnswers = { ...previous }; delete nextAnswers[currentQuestion.id]; return nextAnswers }) }
  const handleCheck = () => { if (!selectedOption) return; setIsAnswerCorrect(selectedOption === currentQuestion.correctAnswer); setShowFeedback(true) }
  const handleContinue = () => { setShowExplanation(false); setShowFeedback(false); if (isLastQuestion) { completeSoundRef.current?.play().catch(() => {}); setIsComplete(true); return }; setCurrentQuestionIndex((index) => index + 1) }
  const handleRedo = () => { setCurrentQuestionIndex(0); setSelectedOption(null); setAnswers({}); setIsAnswerCorrect(false); setShowFeedback(false); setShowExplanation(false); setIsComplete(false); setScore(0); startSoundRef.current?.play().catch(() => {}) }
  if (isComplete) return <Finish score={score} totalQuestions={totalQuestions} xpEarned={score * 10} onRedo={handleRedo} onDone={() => router.push('/dashboard')} />

  return (
    <div className="flex h-dvh min-h-0 max-h-dvh w-full overflow-hidden bg-white">
      <div className={cn('flex h-full min-h-0 w-full flex-col overflow-hidden', showExplanation && !isMobile && 'min-w-0 flex-1')}>
        <header className="flex h-[72px] w-full shrink-0 items-center justify-center px-4 sm:h-[96px] sm:px-6 md:h-[104px]"><div className="flex w-full max-w-[600px] items-center"><button type="button" onClick={() => router.push('/dashboard')} className="flex shrink-0 cursor-pointer items-center justify-center transition-opacity hover:opacity-70" aria-label="Close quiz and return to dashboard"><CloseIcon color="#000000" /></button><div className="ml-[12px] min-w-0 flex-1 sm:ml-[21px]"><Progress value={progressValue} /></div></div></header>
        <main className="mx-auto flex min-h-0 w-full max-w-[600px] flex-1 -translate-y-0 flex-col items-center justify-center overflow-hidden px-4 py-0 sm:px-6 sm:py-0 md:-translate-y-[12px]">
          <h2 className="mb-3 line-clamp-3 w-full shrink-0 overflow-hidden px-2 text-center font-display text-[20px] font-bold leading-[27px] text-[#333333] sm:mb-5 sm:px-0 sm:text-[24px] sm:leading-[34px] md:mb-6 md:text-[28px] md:leading-[38px]">{currentQuestion.question}</h2>
          <div className="flex min-h-0 w-full shrink flex-col gap-2 overflow-hidden px-2 sm:px-0">{currentQuestion.options.map((option) => <QuizSelection key={option.id} label={option.label} optionLetter={option.id} selected={selectedOption === option.id} onToggle={() => handleOptionToggle(option.id)} disabled={showFeedback} />)}</div>
        </main>
        <div className="w-full shrink-0"><Notice onSkip={() => {}} onCheck={handleCheck} onContinue={handleContinue} onExplain={() => setShowExplanation(true)} isCorrect={isAnswerCorrect} hasSelectedOption={hasSelectedOption} showFeedback={showFeedback} /></div>
      </div>
      {showExplanation && <Explanation isOpen={showExplanation} onClose={() => setShowExplanation(false)} explanation={currentQuestion.explanation} fileType="pdf" isSidebar={!isMobile} />}
    </div>
  )
}

export default Quiz
