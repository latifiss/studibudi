'use client'

import { CloseIcon } from '@/public/icons/mono'
import React from 'react'
import Link from 'next/link'
import BaseButton from '@/components/ui/baseButton'
import { LeaveIcon } from '@/public/icons/illustrations'

interface ConfirmLeaveProps {
  onKeepUsing?: () => void
  onProceedToCancel?: () => void
}

const ConfirmLeave = ({
  onKeepUsing,
  onProceedToCancel,
}: ConfirmLeaveProps) => {
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
        <div className='flex flex-col w-full max-w-100 items-center justify-center h-full'>
          

          {/* Heading */}
          <h1 className='font-display text-white text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-3 px-3 sm:px-0 shrink-0 whitespace-nowrap'>
            Going so soon?
          </h1>

          {/* Subtitle */}
          <p className='font-text text-white/80 text-[15px] sm:text-[17px] text-center mb-8 sm:mb-10 px-3 sm:px-0 shrink-0'>
  You&apos;ll be missing out on Studibudi&apos;s superpowers
</p>
                  
                  {/* Leave Icon */}
          <div className='mb-6 sm:mb-8 shrink-0'>
            <LeaveIcon size={211} className="text-white" />
          </div>

          {/* Buttons */}
          <div className='flex flex-col items-center gap-3 sm:gap-3.5 w-full px-3 sm:px-0 shrink-0'>
            <BaseButton 
              variant="base"
              onClick={onKeepUsing}
              className="w-full max-w-100h-10 sm:h-10.5 text-[11px] sm:text-[13px]"
            >
              KEEP USING PRO
            </BaseButton>
            
            <BaseButton 
              variant="ghost"
              onClick={onProceedToCancel}
              className="w-full max-w-100 h-10 sm:h-10.5 text-[11px] sm:text-[13px]"
            >
              PROCEED TO CANCEL
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmLeave