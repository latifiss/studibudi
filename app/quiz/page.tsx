'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation'
import { CloseIcon } from '@/public/icons/mono'
import Progress from '@/components/ui/progress'
import QuizSelection from '@/components/ui/quizSelection'
import Notice from '@/components/ui/notice'
import Finish from '@/components/ui/finish'
import Explanation from '@/components/ui/explanation'

interface Question {
  id: number
  question: string
  options: {
    id: string
    label: string
  }[]
  correctAnswer: string
  explanation: string
}

const fallbackQuestions: Question[] = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: [
      { id: 'A', label: 'Paris' },
      { id: 'B', label: 'London' },
      { id: 'C', label: 'Berlin' },
    ],
    correctAnswer: 'A',
    explanation: `Paris is the capital of France. It has been the capital since 508 AD and is one of the most important cultural and political centers in Europe.

London is the capital of the United Kingdom, not France. It is located in England and is the largest city in the UK.

Berlin is the capital of Germany. It became the capital of a unified Germany in 1990 after the reunification of East and West Germany.`,
  },
  {
    id: 2,
    question: 'What is the largest planet in our solar system?',
    options: [
      { id: 'A', label: 'Jupiter' },
      { id: 'B', label: 'Saturn' },
      { id: 'C', label: 'Neptune' },
    ],
    correctAnswer: 'A',
    explanation: `Jupiter is the largest planet in our solar system. It has a diameter of about 142,984 km at its equator and is more than 11 times the diameter of Earth.

Saturn is the second-largest planet but is much smaller than Jupiter, with a diameter of about 120,536 km.

Neptune is the fourth-largest planet with a diameter of about 49,528 km, making it significantly smaller than both Jupiter and Saturn.`,
  },
  {
    id: 3,
    question: 'What is the chemical symbol for water?',
    options: [
      { id: 'A', label: 'H2O' },
      { id: 'B', label: 'CO2' },
      { id: 'C', label: 'NaCl' },
    ],
    correctAnswer: 'A',
    explanation: `H2O is the chemical symbol for water. It consists of two hydrogen atoms bonded to one oxygen atom.

CO2 is the chemical symbol for carbon dioxide, which is a gas that plants use for photosynthesis.

NaCl is the chemical symbol for sodium chloride, commonly known as table salt.`,
  },
  {
    id: 4,
    question: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'A', label: 'Venus' },
      { id: 'B', label: 'Mars' },
      { id: 'C', label: 'Jupiter' },
    ],
    correctAnswer: 'B',
    explanation: `Mars is known as the Red Planet due to the presence of iron oxide (rust) on its surface, which gives it a reddish appearance.

Venus is known as Earth's "sister planet" due to its similar size and is covered in thick clouds of sulfuric acid.

Jupiter is the largest planet in our solar system and is known for its Great Red Spot, a massive storm.`,
  },
  {
    id: 5,
    question: 'What is the speed of light approximately?',
    options: [
      { id: 'A', label: '300,000 km/s' },
      { id: 'B', label: '150,000 km/s' },
      { id: 'C', label: '500,000 km/s' },
    ],
    correctAnswer: 'A',
    explanation: `The speed of light is approximately 300,000 kilometers per second (km/s) or about 186,000 miles per second. It is the fastest speed in the universe.

150,000 km/s is too slow for the speed of light in a vacuum.

500,000 km/s is too fast - nothing can travel faster than the speed of light in a vacuum.`,
  },
]

const normalizeQuizData = (raw: unknown): Question[] => {
  if (!Array.isArray(raw)) return fallbackQuestions

  return raw
    .map((item: any, index: number) => {
      if (!item || typeof item.question !== 'string') return null

      const options = Array.isArray(item.options)
        ? item.options.map((option: any) => ({
            id: String(option?.id ?? option?.label?.[0] ?? 'A'),
            label: String(option?.label ?? '')
          }))
        : []

      if (options.length === 0) return null

      return {
        id: Number(item.id ?? index + 1),
        question: item.question,
        options,
        correctAnswer: String(item.correctAnswer ?? item.answer ?? options[0]?.id ?? 'A'),
        explanation: String(item.explanation ?? 'No explanation provided.'),
      }
    })
    .filter(Boolean) as Question[]
}

const loadStoredQuiz = (): Question[] => {
  try {
    const storedQuiz = localStorage.getItem('currentQuiz')
    if (!storedQuiz) return fallbackQuestions

    const parsedQuiz = JSON.parse(storedQuiz)
    const normalized = normalizeQuizData(parsedQuiz)
    return normalized.length > 0 ? normalized : fallbackQuestions
  } catch (error) {
    console.error('Failed to load generated quiz from storage:', error)
    return fallbackQuestions
  }
}

const Quiz = () => {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>(fallbackQuestions)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean>(false)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const startSoundRef = useRef<HTMLAudioElement | null>(null)
  const completeSoundRef = useRef<HTMLAudioElement | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setQuestions(loadStoredQuiz())
  }, [])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progressValue = ((currentQuestionIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1
  const hasSelectedOption = selectedOption !== null

  // Calculate score whenever answers change
  useEffect(() => {
    let correctCount = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })
    setScore(correctCount)
  }, [answers])

  // Load sounds
  useEffect(() => {
    startSoundRef.current = new Audio('/sounds/start.mp3')
    completeSoundRef.current = new Audio('/sounds/complete.mp3')
    
    startSoundRef.current.load()
    completeSoundRef.current.load()
    
    if (startSoundRef.current) {
      startSoundRef.current.play().catch(() => {})
    }
    setQuizStarted(true)

    return () => {
      if (startSoundRef.current) {
        startSoundRef.current.pause()
        startSoundRef.current = null
      }
      if (completeSoundRef.current) {
        completeSoundRef.current.pause()
        completeSoundRef.current = null
      }
    }
  }, [])

  const playCompleteSound = () => {
    if (completeSoundRef.current) {
      completeSoundRef.current.currentTime = 0
      completeSoundRef.current.play().catch(() => {})
    }
  }

  const handleOptionToggle = (optionId: string) => {
    if (showFeedback) return
    
    const isSelected = selectedOption === optionId
    const newSelected = isSelected ? null : optionId
    setSelectedOption(newSelected)
    
    if (newSelected) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: newSelected,
      })
    } else {
      const newAnswers = { ...answers }
      delete newAnswers[currentQuestion.id]
      setAnswers(newAnswers)
    }
  }

  const handleCheck = () => {
    if (!hasSelectedOption) return
    
    const isCorrect = selectedOption === currentQuestion.correctAnswer
    setIsAnswerCorrect(isCorrect)
    setShowFeedback(true)
  }

  const handleContinue = () => {
    // Close explanation before continuing
    setShowExplanation(false)
    setShowFeedback(false)
    setIsAnswerCorrect(false)
    
    if (isLastQuestion) {
      playCompleteSound()
      setIsComplete(true)
      console.log('Quiz complete!')
    } else if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      const savedAnswer = answers[nextIndex] || null
      setSelectedOption(savedAnswer)
    }
  }

  const handleSkip = () => {
    console.log('Skipped')
  }

  const handleExplain = () => {
    setShowExplanation(true)
  }

  const handleCloseExplanation = () => {
    setShowExplanation(false)
  }

  const handleRedo = () => {
    const storedQuestions = loadStoredQuiz()

    setQuestions(storedQuestions)
    setCurrentQuestionIndex(0)
    setSelectedOption(null)
    setAnswers({})
    setIsAnswerCorrect(false)
    setShowFeedback(false)
    setIsComplete(false)
    setScore(0)
    setShowExplanation(false)

    if (startSoundRef.current) {
      startSoundRef.current.currentTime = 0
      startSoundRef.current.play().catch(() => {})
    }
  }

  const handleDone = () => {
    router.push('/dashboard')
  }

  // Reset feedback when question changes
  useEffect(() => {
    if (!isComplete) {
      setShowFeedback(false)
      setIsAnswerCorrect(false)
      const savedAnswer = answers[currentQuestion.id] || null
      setSelectedOption(savedAnswer)
    }
  }, [currentQuestionIndex, currentQuestion.id, isComplete])

  // If quiz is complete, show Finish component
  if (isComplete) {
    return (
      <Finish
        score={score}
        totalQuestions={totalQuestions}
        xpEarned={score * 10}
        onRedo={handleRedo}
        onDone={handleDone}
      />
    )
  }

  return (
    <div className={cn(
      'flex h-screen max-h-screen overflow-hidden bg-white',
      // When explanation is open on desktop/tablet, use flex layout
      showExplanation && !isMobile && 'flex-row'
    )}>
      {/* Quiz Content Container */}
      <div className={cn(
        'flex flex-col w-full h-full overflow-hidden',
        // When explanation is open on desktop/tablet, shrink the quiz content
        showExplanation && !isMobile && 'flex-1 min-w-0'
      )}>
        {/* Header */}
        <div className='flex items-center justify-center w-full shrink-0 pt-4 sm:pt-[50px] pb-6 sm:pb-[86px] px-4 sm:px-6'>
          <div className='flex items-center w-full max-w-[600px]'>
            <Link 
              href="/"
              className="cursor-pointer hover:opacity-70 transition-opacity shrink-0"
              aria-label="Go to home"
            >
              <CloseIcon color="#000000" />
            </Link>

            <div className="flex-1 ml-[12px] sm:ml-[21px]">
              <Progress value={progressValue} />
            </div>
          </div>
        </div>

        {/* Question Section */}
        <div className='flex flex-col items-center justify-center w-full max-w-[600px] mx-auto flex-1 min-h-0 px-4 sm:px-6 pb-4 sm:pb-8 lg:pb-12'>
          <h2 className='font-display text-[#333333] text-[20px] sm:text-[24px] md:text-[28px] leading-[28px] sm:leading-[34px] md:leading-[40px] tracking-normal font-bold text-center mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0'>
            {currentQuestion.question}
          </h2>

          <div className='flex flex-col gap-2 w-full px-2 sm:px-0'>
            {currentQuestion.options.map((option) => (
              <QuizSelection
                key={option.id}
                label={option.label}
                optionLetter={option.id}
                selected={selectedOption === option.id}
                onToggle={() => handleOptionToggle(option.id)}
                disabled={showFeedback}
              />
            ))}
          </div>
        </div>

        {/* Notice Component */}
        <div className="shrink-0 mt-auto">
          <Notice
            onSkip={handleSkip}
            onCheck={handleCheck}
            onContinue={handleContinue}
            onExplain={handleExplain}
            isCorrect={isAnswerCorrect}
            hasSelectedOption={hasSelectedOption}
            showFeedback={showFeedback}
          />
        </div>
      </div>

      {/* Explanation - Sidebar (Desktop/Tablet) or Bottom Sheet (Mobile) */}
      {showExplanation && (
        <Explanation
          isOpen={showExplanation}
          onClose={handleCloseExplanation}
          explanation={currentQuestion.explanation}
          fileType="pdf"
          isSidebar={!isMobile}
        />
      )}
    </div>
  )
}

export default Quiz