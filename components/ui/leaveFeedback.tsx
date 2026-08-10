'use client'

import { CloseIcon } from '@/public/icons/mono'
import React, { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import BaseButton from '@/components/ui/baseButton'

interface OptionItem {
  id: string
  label: string
}

const options: OptionItem[] = [
  { id: 'price', label: 'PRO is out of my price range' },
  { id: 'temporary', label: 'I wanted to try PRO temporarily' },
  { id: 'accident', label: 'I subscribed by accident' },
  { id: 'technical', label: 'I had technical issues with PRO' },
  { id: 'not_valuable', label: 'I didn\'t find PRO features valuable' },
  { id: 'other', label: 'Other' },
]

const LeaveFeedback = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelectedId(id)
  }

  const handleContinue = () => {
    console.log('Selected option:', selectedId)
    // Handle continue action
  }

  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden bg-[#000437] px-3 sm:px-0'>
      {/* Header */}
      <div className='flex items-center justify-start w-full h-14 sm:h-18 px-3 sm:px-9 shrink-0'>
        <Link 
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <CloseIcon color="#ffffff" />
        </Link>
      </div>

      {/* Content */}
      <div className='flex items-center justify-center w-full flex-1 min-h-0 py-4 sm:py-8 pb-0 sm:pb-20'>
        <div className='flex flex-col w-full max-w-[400px] items-center justify-center h-full'>
          {/* Heading */}
          <h1 className='font-display text-white text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 sm:mb-8 px-3 sm:px-0 shrink-0 whitespace-nowrap'>
            Why are you cancelling PRO?
          </h1>

          {/* Options List */}
          <div className='flex flex-col w-full px-3 sm:px-0 shrink-0'>
            {options.map((option, index) => {
              const isSelected = selectedId === option.id
              const isFirst = index === 0
              const isLast = index === options.length - 1
              const isPrevSelected = selectedId === options[index - 1]?.id
              const isNextSelected = selectedId === options[index + 1]?.id

              return (
                <div key={option.id}>
                  {/* Top gap line - hidden when this item or previous item is selected */}
                  {!isFirst && !isSelected && !isPrevSelected && (
                    <div className="h-[1px] bg-[#E5E5E5] w-full" />
                  )}
                  
                  <button
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'w-full px-4 sm:px-5 py-3 sm:py-4',
                      'font-text text-[13px] sm:text-[15px] font-medium text-left',
                      'transition-colors duration-200 ease-in-out',
                      'bg-white text-[#333333]',
                      // Border styles
                      'border-2',
                      isSelected ? 'border-[#84D8FF]' : 'border-transparent',
                      // Background and text for selected state
                      isSelected && 'bg-[#DDF4FF] text-[#1498D7]',
                      // Border radius
                      isFirst && 'rounded-t-2xl',
                      isLast && 'rounded-b-2xl',
                      // Remove border radius between items
                      !isFirst && 'rounded-t-none',
                      !isLast && 'rounded-b-none',
                      // Hover state
                      !isSelected && 'hover:bg-gray-50'
                    )}
                  >
                    {option.label}
                  </button>

                  {/* Bottom gap line - hidden when this item or next item is selected */}
                  {!isLast && !isSelected && !isNextSelected && (
                    <div className="h-[1px] bg-[#E5E5E5] w-full" />
                  )}
                </div>
              )
            })}
          </div>

          {/* Continue Button */}
          <div className='flex flex-col items-center w-full px-3 sm:px-0 mt-6 sm:mt-8 shrink-0'>
            <BaseButton 
              variant="alternate"
              onClick={handleContinue}
              disabled={!selectedId}
              className="w-full max-w-[400px] h-10 sm:h-[42px] text-[11px] sm:text-[13px]"
            >
              Continue
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeaveFeedback