'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { CorrectIcon, WrongIcon, BulbIcon } from '@/public/icons/mono'

interface NoticeProps {
  onSkip?: () => void
  onCheck?: () => void
  onContinue?: () => void
  onExplain?: () => void
  isCorrect?: boolean
  hasSelectedOption?: boolean
  showFeedback?: boolean
  className?: string
  enableSounds?: boolean
}

const Notice = ({
  onSkip,
  onCheck,
  onContinue,
  onExplain,
  isCorrect = false,
  hasSelectedOption = false,
  showFeedback = false,
  className,
  enableSounds = true,
  ...props
}: NoticeProps) => {
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle')
  const [audioElements, setAudioElements] = useState<{
    correct: HTMLAudioElement | null
    wrong: HTMLAudioElement | null
  }>({
    correct: null,
    wrong: null,
  })

  useEffect(() => {
    if (!showFeedback) {
      setStatus('idle')
    }
  }, [showFeedback])

  useEffect(() => {
    if (showFeedback) {
      if (isCorrect) {
        setStatus('correct')
        playSound('correct')
      } else {
        setStatus('wrong')
        playSound('wrong')
      }
    }
  }, [isCorrect, showFeedback])

  useEffect(() => {
    if (enableSounds) {
      const correctSound = new Audio('/sounds/correct.mp3')
      const wrongSound = new Audio('/sounds/wrong.mp3')

      correctSound.load()
      wrongSound.load()

      setAudioElements({
        correct: correctSound,
        wrong: wrongSound,
      })
    }
  }, [enableSounds])

  const playSound = (type: 'correct' | 'wrong') => {
    if (!enableSounds) return

    const sound = audioElements[type]
    if (sound) {
      sound.currentTime = 0
      sound.play().catch(() => {
        console.log('Sound playback failed')
      })
    }
  }

  const handleCheck = () => {
    if (!hasSelectedOption) return
    onCheck?.()
  }

  const handleContinue = () => {
    onContinue?.()
  }

  const handleExplain = () => {
    onExplain?.()
  }

  const handleSkip = () => {
    onSkip?.()
  }

  const isAnswered = status === 'correct' || status === 'wrong'

  return (
    <div
      className={cn(
        'flex items-center justify-between w-full min-h-[130px] md:min-h-[75px] lg:h-[90px] px-4 py-10 md:px-[15%] md:py-0',
        'border-t-2 border-[#E5E5E5]',
        'transition-colors duration-300 ease-in-out',
        status === 'correct' && 'bg-[#D7FFB8]',
        status === 'wrong' && 'bg-[#FFE6E5]',
        status === 'idle' && 'bg-transparent',
        className
      )}
      {...props}
    >
      {!isAnswered ? (
        <button
          onClick={handleSkip}
          className="w-[120px] md:w-[135px] lg:w-[151px] h-[40px] md:h-[42px] lg:h-[44px] flex items-center justify-center rounded-[12px] md:rounded-[14px] lg:rounded-[16px] border-2 border-[#E1E1E1] bg-white shadow-[0_2px_0_0_#E1E1E1] text-[#A6A6A6] font-text text-[13px] md:text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.8px] hover:bg-gray-50 transition-colors"
        >
          Skip
        </button>
      ) : (
        <div className="flex items-center gap-[8px] md:gap-[10px] lg:gap-[12px]">
          <div className={cn(
            'transition-transform duration-300',
            status === 'correct' && 'animate-bounce',
            status === 'wrong' && 'animate-shake'
          )}>
            {status === 'correct' ? (
              <CorrectIcon color="#16A34A" size={48} mdSize={56} lgSize={64} />
            ) : (
              <WrongIcon color="#FE1212" size={48} mdSize={56} lgSize={64} />
            )}
          </div>

          <div className="flex flex-col gap-0.5 md:gap-1">
            <span
              className={cn(
                'font-display text-[16px] md:text-[17px] lg:text-[18px] font-bold transition-all duration-300',
                status === 'correct'
                  ? 'text-[#34A853] drop-shadow-[0_2px_0_0_#489D26] md:drop-shadow-[0_2px_0_0_#489D26] lg:drop-shadow-[0_3px_0_0_#489D26]'
                  : 'text-[#FE1212] drop-shadow-[0_2px_0_0_#D60D0D] md:drop-shadow-[0_2px_0_0_#D60D0D] lg:drop-shadow-[0_3px_0_0_#D60D0D]'
              )}
            >
              {status === 'correct' ? "That's correct" : "Oops! That's wrong"}
            </span>

            <button
              onClick={handleExplain}
              className="flex items-center gap-[2px] md:gap-[2px] lg:gap-[3px] h-[28px] md:h-[29px] lg:h-[30px] w-fit shrink-0 px-1.5 md:px-[5px] lg:px-2 rounded-[6px] md:rounded-[7px] lg:rounded-[8px] bg-white border-[1.5px] border-transparent hover:opacity-80 transition-opacity"
              style={{
                backgroundImage: 'linear-gradient(white, white), radial-gradient(circle at 50% 50%, #FADF73, #FFD500, #FC9900)',
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
              }}
            >
              <BulbIcon size={14} mdSize={20} lgSize={22} />
              <span
                className="font-text text-[11px] md:text-[11px] lg:text-[12px] font-medium whitespace-nowrap bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 50%, #FADF73, #FFD500, #FC9900)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Explain for me
              </span>
            </button>
          </div>
        </div>
      )}

      {!isAnswered ? (
        <button
          onClick={handleCheck}
          disabled={!hasSelectedOption}
          className={cn(
            'w-[120px] md:w-[135px] lg:w-[151px] h-[40px] md:h-[42px] lg:h-[44px] flex items-center justify-center rounded-[12px] md:rounded-[14px] lg:rounded-[16px] font-text text-[13px] md:text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.8px] transition-colors',
            hasSelectedOption
              ? 'bg-[#22C55E] text-white shadow-[0_2px_0_0_#489D26] md:shadow-[0_2px_0_0_#489D26] lg:shadow-[0_3px_0_0_#489D26] hover:bg-[#16A34A] cursor-pointer'
              : 'bg-[#E5E5E5] text-[#A6A6A6] shadow-none cursor-not-allowed'
          )}
        >
          Check
        </button>
      ) : (
        <button
          onClick={handleContinue}
          className={cn(
            'w-[120px] md:w-[135px] lg:w-[151px] h-[40px] md:h-[42px] lg:h-[44px] flex items-center justify-center rounded-[12px] md:rounded-[14px] lg:rounded-[16px] text-white font-text text-[13px] md:text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.8px] hover:opacity-90 transition-colors cursor-pointer',
            status === 'correct'
              ? 'bg-[#22C55E] shadow-[0_2px_0_0_#489D26] md:shadow-[0_2px_0_0_#489D26] lg:shadow-[0_3px_0_0_#489D26] hover:bg-[#16A34A]'
              : 'bg-[#FE1212] shadow-[0_2px_0_0_#D60D0D] md:shadow-[0_2px_0_0_#D60D0D] lg:shadow-[0_3px_0_0_#D60D0D] hover:bg-[#E01010]'
          )}
        >
          Continue
        </button>
      )}
    </div>
  )
}

export default Notice
