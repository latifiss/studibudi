'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CompareProps {
  className?: string
}

const Compare = ({ className }: CompareProps) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-19.5 lg:px-0',
        'max-w-none lg:max-w-210',
        'flex flex-col items-center',
        className
      )}
    >
      <h2
        className={cn(
          'text-center text-[#333333]',
          'text-[28px] sm:text-[34px] lg:text-[40px]',
          'leading-9 sm:leading-10.5 lg:leading-12',
          'font-display font-medium',
          'max-w-100 sm:max-w-110 lg:max-w-124',
          'mb-4 sm:mb-5 lg:mb-6'
        )}
      >
        studibudi vs ChatGPT,<br />
        Gemini & Other AI Chats
      </h2>

      <p
        className={cn(
          'text-center text-[#333333]',
          'text-[15px] sm:text-[16px] lg:text-[18px]',
          'leading-5 sm:leading-5.5 lg:leading-6',
          'font-text font-normal',
          'max-w-full sm:max-w-full lg:max-w-210',
          'px-2 sm:px-0'
        )}
      >
        Generic AI tools like ChatGPT or DeepSeek are great for answering questions—but they don&apos;t quiz you. They give you answers, not practice. Our tool is built specifically for students: it pulls directly from your notes, generates targeted questions, and checks your understanding. No generic responses. No hallucinations. Just a personalized quiz engine that turns passive reading into active recall.
      </p>
    </div>
  )
}

export default Compare