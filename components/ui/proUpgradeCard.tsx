'use client'

import { CheckIcon, CloseIcon, ProIcon } from '@/public/icons/mono'
import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import BaseButton from '@/components/ui/baseButton'

interface GridContainerProps {
  first: React.ReactNode
  second: React.ReactNode
  third: React.ReactNode
  className?: string
  hideBorder?: boolean
  isFirst?: boolean
  isLast?: boolean
}

export const GridContainer = ({
  first,
  second,
  third,
  className,
  hideBorder = false,
  isFirst = false,
  isLast = false,
  ...props
}: GridContainerProps) => {
  return (
    <div
      className={cn(
        'grid w-full max-w-100 px-3 sm:px-0',
        'grid-cols-[1fr_70px_80px] sm:grid-cols-[1fr_91px_103px]',
        'gap-0',
        className
      )}
      {...props}
    >
      <div className={cn(
        'flex items-center justify-start h-10 sm:h-12 min-w-0 overflow-hidden',
        'text-[11px] sm:text-sm',
        !hideBorder && 'border-b-2 border-white/20'
      )}>
        {first}
      </div>
      <div className={cn(
        'flex items-center justify-center h-10 sm:h-12 min-w-0 overflow-hidden',
        'text-[11px] sm:text-sm',
        !hideBorder && 'border-b-2 border-white/20'
      )}>
        {second}
      </div>
      <div className={cn(
        'flex items-center justify-center h-10 sm:h-12 min-w-0 overflow-hidden',
        'text-[11px] sm:text-sm',
        !hideBorder && 'border-b-2 border-white/20',
        'bg-white/20',
        isFirst && 'rounded-tl-2xl rounded-tr-2xl',
        isLast && 'rounded-bl-2xl rounded-br-2xl'
      )}>
        {third}
      </div>
    </div>
  )
}

const ProUpgradeCard = () => {
  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden bg-[#000437] px-3 sm:px-0'>
      <div className='flex items-center justify-start w-full h-14 sm:h-18 px-3 sm:px-9 shrink-0'>
        <Link 
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <CloseIcon color="#ffffff" />
        </Link>
      </div>
      <div className='flex items-center justify-center w-full flex-1 min-h-0 py-4 sm:py-8'>
        <div className='flex flex-col w-full max-w-100 items-center justify-center h-full'>
          <h1 className='font-display text-white text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-11 px-3 sm:px-0 shrink-0'>
            Get more with PRO
          </h1>
          <div className='flex flex-col items-center w-full px-3 sm:px-0 shrink-0'>
            <GridContainer 
              first={<div></div>}
              second={<h2 className='font-text text-white text-[11px] sm:text-[16px] font-bold text-left uppercase'>Free</h2>}
              third={<ProIcon className="w-7 h-7 sm:w-auto sm:h-auto" />}
              isFirst={true}
            />
            <GridContainer
              first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Quizes</h2>}
              second={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>2</h2>}
              third={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Unlimited</h2>}
            />
            <GridContainer
              first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Number of uploads</h2>}
              second={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>2</h2>}
              third={<CheckIcon color='#ffffff' size={12} />}
            />
            <GridContainer
              first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Answer Explanation</h2>}
              second={<CheckIcon color='#ffffff' size={12} />}
              third={<CheckIcon color='#ffffff' size={12} />}
            />
            <GridContainer
              first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Redo Quiz</h2>}
              second={<div></div>}
              third={<CheckIcon color='#ffffff' size={12} />}
              hideBorder={true}
              isLast={true}
            />
          </div>

          {/* Buttons Section */}
          <div className='flex flex-col items-center gap-3 sm:gap-3.5 mt-6 sm:mt-11.75 w-full px-3 sm:px-0 shrink-0'>
            <BaseButton 
              variant="long"
              onClick={() => console.log('Subscribe to Pro')}
              className="w-full max-w-100 h-10 sm:h-10.5 text-[11px] sm:text-[13px]"
            >
              Subscribe to Pro
            </BaseButton>
            <button 
              onClick={() => console.log('Cancel')}
              className="font-text text-white text-[11px] sm:text-[13px] font-medium hover:opacity-70 transition-opacity uppercase tracking-normal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProUpgradeCard