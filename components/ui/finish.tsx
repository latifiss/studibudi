'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import FinishNotice from '@/components/ui/finishNotice'
import { DoneProgressIcon, RewardIcon } from '@/public/icons/illustrations'

interface FinishProps {
  score?: number
  totalQuestions?: number
  xpEarned?: number
  onRedo?: () => void
  onDone?: () => void
  className?: string
}

const Finish = ({
  score = 7,
  totalQuestions = 10,
  xpEarned = 30,
  onRedo,
  onDone,
  className,
  ...props
}: FinishProps) => {
  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden bg-white'>
      {/* Content - Centered */}
      <div className='flex flex-col items-center justify-center flex-1 min-h-0 px-4 sm:px-6'>
        <div className='flex flex-col items-center'>
          {/* Reward Icon */}
          <RewardIcon size={120} />

          {/* 37px spacing */}
          <div className="h-[37px]" />

          {/* Progress Icon (not the green one) */}
          {/* <DoneProgressIcon size={180} /> */}

          {/* 29px spacing */}
          <div className="h-[29px]" />

          {/* Title */}
          <h1 className='font-display text-[#333333] text-[21px] font-bold text-center'>
            You've completed the quiz
          </h1>

          {/* 24px spacing */}
          <div className="h-[24px]" />

          {/* Score + XP */}
          <div className='flex items-center gap-2'>
            <span className='font-text text-[16px] font-medium text-[#777777]'>
              Your Score
            </span>
            <span className='font-text text-[16px] font-medium text-[#FFC800]'>
              +{xpEarned}xp
            </span>
          </div>

          {/* 24px spacing */}
          <div className="h-[24px]" />

          {/* Results text */}
          <p className='font-text text-[16px] font-medium text-[#777777] text-center'>
            You got <span className='text-[#22C55E]'>{score}</span> out of {totalQuestions} questions correct
          </p>
        </div>
      </div>

      {/* Finish Notice - Bottom */}
      <div className="shrink-0 mt-auto">
        <FinishNotice
          onRedo={onRedo}
          onDone={onDone}
        />
      </div>
    </div>
  )
}

export default Finish