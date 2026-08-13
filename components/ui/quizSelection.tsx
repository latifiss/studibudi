'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface QuizSelectionProps {
  label: string
  optionLetter: string
  selected?: boolean
  onToggle?: (isSelected: boolean) => void
  disabled?: boolean
  className?: string
}

const QuizSelection = ({
  label,
  optionLetter,
  selected: controlledSelected,
  onToggle,
  disabled = false,
  className,
  ...props
}: QuizSelectionProps) => {
  // Internal state for uncontrolled mode
  const [internalSelected, setInternalSelected] = useState(false)
  
  // Determine if component is controlled or uncontrolled
  const isControlled = controlledSelected !== undefined
  const isSelected = isControlled ? controlledSelected : internalSelected

  const handleClick = () => {
    if (disabled) return

    const newSelectedState = !isSelected
    
    if (!isControlled) {
      setInternalSelected(newSelectedState)
    }
    
    onToggle?.(newSelectedState)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-3 sm:gap-4 w-full max-w-[600px] min-h-[58px] px-3 sm:px-[18px]',
        'border-2 rounded-[8px]',
        'transition-all duration-200 ease-in-out',
        // Default state
        'bg-white border-[#E5E5E5] shadow-[0_2px_0_0_#E5E5E5]',
        'text-[#4B4B4B]',
        // Selected state
        isSelected && 'bg-[#DDF4FF] border-[#84D8FF] shadow-[0_2px_0_0_#84D8FF] text-[#1899D6]',
        // Disabled state
        disabled && 'cursor-not-allowed opacity-70',
        // Hover state
        !isSelected && !disabled && 'hover:bg-gray-50',
        className
      )}
      {...props}
    >
      {/* Option Letter Container */}
      <div
        className={cn(
          'flex items-center justify-center w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] shrink-0',
          'border-2 rounded-[8px]',
          'bg-transparent',
          // Default state
          'border-[#E5E5E5] text-[#AFAFAF]',
          // Selected state
          isSelected && 'border-[#84D8FF] text-[#1899D6]'
        )}
      >
        <span className="font-text text-[13px] sm:text-[15px] font-medium uppercase">
          {optionLetter}
        </span>
      </div>

      {/* Label Text - Centered */}
      <span className="font-text text-[15px] sm:text-[17px] font-medium text-center flex-1">
        {label}
      </span>
    </button>
  )
}

export default QuizSelection