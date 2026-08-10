'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { UploadIcon, DocumentIcon, AnswerIcon } from '@/public/icons/illustrations'
import { RightIcon } from '@/public/icons/mono'

interface HowProps {
  className?: string
}

const How = ({ className }: HowProps) => {
  const items = [
    {
      number: '1',
      icon: <UploadIcon size={120} className="pt-4" />,
      text: 'Upload your document',
    },
    {
      number: '2',
      icon: <DocumentIcon size={120} />,
      text: 'Let StudiBudi create a quiz from your document',
    },
    {
      number: '3',
      icon: <AnswerIcon size={120} />,
      text: 'Answer the questions and get insights',
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
          'mb-6 sm:mb-7 lg:mb-8'
        )}
      >
        How to Create a Quiz
      </h2>

      <div
        className={cn(
          'flex flex-col sm:flex-row items-start justify-center',
          'w-full',
          'relative sm:gap-0',
          'gap-5.5 sm:gap-0'
        )}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start sm:gap-1',
              'w-full sm:w-auto',
              'sm:flex-1',
              'max-w-70 sm:max-w-none',
              'relative',
              'ml-4 sm:ml-13'
            )}
          >
            <span
              className={cn(
                'font-display text-[#333333]',
                'text-[40px] sm:text-[44px] lg:text-[50px]',
                'leading-14 sm:leading-16 lg:leading-18',
                'font-medium',
                'shrink-0',
                '-mr-18',
                'mt-2',
                'ml-17 sm:ml-0'
              )}
            >
              {item.number}
            </span>

            <div className="flex flex-col items-center flex-1">
              <div className="w-25 sm:w-30 lg:w-35 h-25 sm:h-30 lg:h-35 flex items-center justify-center">
                {item.icon}
              </div>
              <p
                className={cn(
                  'text-center text-[#333333]',
                  'text-[15px] sm:text-[16px] lg:text-[18px]',
                  'leading-5 sm:leading-5.5 lg:leading-6',
                  'font-normal',
                  'font-text',
                  'mt-3 sm:mt-3.5 lg:mt-4',
                  'max-w-53'
                )}
              >
                {item.text}
              </p>
            </div>

            {index < items.length - 1 && (
              <div className="hidden sm:block absolute -right-8 top-1/2 -translate-y-1/2 z-10">
                <RightIcon
                  size={65}
                  className={cn(
                    'text-[#333333]',
                    index === 0 ? 'rotate-0' : 'rotate-20 -translate-y-4'
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default How