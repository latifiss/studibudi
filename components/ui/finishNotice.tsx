'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FinishNoticeProps {
  onRedo?: () => void
  onDone?: () => void
  className?: string
}

const FinishNotice = ({
  onRedo,
  onDone,
  className,
  ...props
}: FinishNoticeProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full min-h-[90px] md:min-h-[100px] lg:h-[120px] px-4 md:px-7 lg:px-[260px]',
        'border-t-2 border-[#E5E5E5]',
        'bg-transparent',
        className
      )}
      {...props}
    >
      {/* Left side - Redo button */}
      <button
        onClick={onRedo}
        className="w-[120px] md:w-[135px] lg:w-[151px] h-[40px] md:h-[42px] lg:h-[44px] flex items-center justify-center rounded-[12px] md:rounded-[14px] lg:rounded-[16px] border-2 border-[#E1E1E1] bg-white shadow-[0_2px_0_0_#E1E1E1] text-[#A6A6A6] font-text text-[13px] md:text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.8px] hover:bg-gray-50 transition-colors"
      >
        Redo
      </button>

      {/* Right side - Done button */}
      <button
        onClick={onDone}
        className="w-[120px] md:w-[135px] lg:w-[151px] h-[40px] md:h-[42px] lg:h-[44px] flex items-center justify-center rounded-[12px] md:rounded-[14px] lg:rounded-[16px] bg-[#22C55E] text-white font-text text-[13px] md:text-[14px] lg:text-[15px] font-medium uppercase tracking-[0.8px] shadow-[0_2px_0_0_#489D26] md:shadow-[0_2px_0_0_#489D26] lg:shadow-[0_3px_0_0_#489D26] hover:bg-[#16A34A] transition-colors"
      >
        Done
      </button>
    </div>
  )
}

export default FinishNotice