'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { OptAIcon, OptBIcon, OptCIcon, OptDIcon } from '@/public/icons/illustrations'

interface DetailProps {
  className?: string
}

const Detail = ({ className }: DetailProps) => {
  const items = [
    {
      icon: <OptAIcon size={145} />,
      title: 'Generate Quiz from your file',
      description: (
        <>
          Upload your lecture notes, slides, or textbook PDFs and instantly generate a custom practice quiz.{' '}
          <span className="font-bold">Multiple-choice questions with answer explanations, pulled directly from your material.</span>
        </>
      ),
    },
    {
      icon: <OptBIcon size={145} />,
      title: 'Get Explanations to Answers',
      description: (
        <>
          Every question comes with a clear, concise explanation. See why the correct answer is right and the others aren&apos;t,{' '}
          <span className="font-bold">so you actually understand the material, not just memorize it.</span>
        </>
      ),
    },
    {
      icon: <OptCIcon size={145} />,
      title: 'Retry quizzes until you nail it.',
      description: (
        <>
          Didn&apos;t ace it the first time? No problem. Retry any quiz as many times as you want.{' '}
          <span className="font-bold">Practice until you&apos;re confident, not just until you&apos;re done.</span>
        </>
      ),
    },
    {
      icon: <OptDIcon size={145} />,
      title: 'Complex Stuff Made Simple',
      description: (
        <>
          Break down dense lectures, confusing slides, and thick textbooks into bite-sized quizzes.{' '}
          <span className="font-bold">StudiBud takes the complex and turns it into simple, testable questions.</span>
        </>
      ),
    },
  ]

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
          'text-[32px] sm:text-[36px] lg:text-[40px]',
          'leading-10 sm:leading-11 lg:leading-12',
          'font-display font-medium',
          'mb-8 sm:mb-10 lg:mb-12'
        )}
      >
        Learn better and Faster
      </h2>

      <div
        className={cn(
          'grid grid-cols-1 sm:grid-cols-2',
          'gap-x-8 sm:gap-x-12 lg:gap-x-16',
          'gap-y-8 sm:gap-y-10 lg:gap-y-12',
          'w-full',
          'max-w-210'
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex flex-col items-center',
              'bg-transparent',
              'w-full',
              'max-w-93 mx-auto sm:mx-0'
            )}
          >
            <div className="w-full h-44 bg-[#EDEDED] rounded-xl border border-black/10 flex items-center justify-center mb-4">
              {item.icon}
            </div>

            <h3
              className={cn(
                'text-center text-[#333333]',
                'text-[20px] sm:text-[22px] lg:text-[24px]',
                'leading-6.5 sm:leading-7 lg:leading-7.5',
                'font-bold',
                'font-text',
                'mb-3',
                'w-[80%]'
              )}
            >
              {item.title}
            </h3>

            <p
              className={cn(
                'text-center text-[#333333]',
                'text-[15px] sm:text-[16px] lg:text-[18px]',
                'leading-6 sm:leading-6.5 lg:leading-7.5',
                'font-medium',
                'font-text',
                'w-full'
              )}
            >
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Detail