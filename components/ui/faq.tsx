'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items?: FAQItem[]
  className?: string
}

const defaultFAQItems: FAQItem[] = [
  {
    question: 'What exactly does StudiBud do?',
    answer: 'StudiBud turns your lecture notes, slides, or textbook chapters into personalized practice quizzes. Upload your material, and we generate multiple-choice questions with instant answer explanations – so you can test yourself.',
  },
  {
    question: 'How is this different from just asking ChatGPT?',
    answer: 'ChatGPT gives you answers. StudiBud quizzes you. Instead of generic responses, we pull directly from your uploaded documents to create targeted questions. You\'re practicing interactively with your own course material, not random Internet content.',
  },
  {
    question: 'What file types can I upload?',
    answer: 'We support PDFs, PowerPoint slides (.pptx), and plain text files (.txt). More formats (like Word docs and images) are coming soon.',
  },
  {
    question: 'Is my data safe and private?',
    answer: 'Absolutely. Your documents are used only to generate your quiz and are not stored permanently. We don\'t share your data with third parties or use it to train our models.',
  },
  {
    question: 'Do I need to download anything?',
    answer: 'Nope. StudiBud works entirely in your browser—on laptop, tablet, or phone. No installations, no sign-up required to start.',
  },
  {
    question: 'Is it really free?',
    answer: 'Yes! StudiBud is free to use for basic quizzes. For heavier usage (long documents or unlimited generations), we offer a cheap student-friendly premium plan.',
  },
]

const FAQ = ({
  items = defaultFAQItems,
  className,
  ...props
}: FAQProps) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-17 lg:px-0',
        'py-0',
        'max-w-none lg:max-w-180',
        className
      )}
      {...props}
    >
      <h2 className={cn(
        'text-center font-display font-medium',
        'text-[32px] sm:text-[32px] lg:text-[40px]',
        'leading-10 sm:leading-10 lg:leading-12',
        'text-[#333333]',
        'mb-3 sm:mb-3 lg:mb-3.5'
      )}>
        Frequently Asked Questions
      </h2>

      <div className="flex flex-col gap-7 lg:gap-8.5">
        {items.map((item, index) => (
          <div key={index} className="flex flex-col">
            <h3 className={cn(
              'font-text font-bold text-left',
              'text-[17px] sm:text-[17px] lg:text-[20px]',
              'leading-6 sm:leading-6 lg:leading-7',
              'text-[#333333]',
              'mb-0'
            )}>
              {item.question}
            </h3>

            <p className={cn(
              'font-text font-regular text-left',
              'text-[15px] sm:text-[15px] lg:text-[18px]',
              'leading-5 sm:leading-5 lg:leading-6',
              'text-[#737373]',
              'mt-0'
            )}>
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQ