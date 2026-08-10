import React from 'react'
import { cn } from '@/lib/utils'

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'alternate' | 'long' | 'base' | 'ghost' | 'ghostLong' | 'hostLong' | 'outline'
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const BaseButton = ({
  variant = 'default',
  children,
  onClick,
  className,
  disabled = false,
  ...props
}: BaseButtonProps) => {
  const baseStyles = cn(
    'font-text inline-flex items-center justify-center rounded-[8px]',
    'text-[13px] font-bold leading-[18px] tracking-normal uppercase',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F4CF0]',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    className
  )

  const variantStyles = {
    default: cn(
      'bg-[#4F4CF0] text-white',
      'hover:bg-[#3F3CD0] active:bg-[#2F2CB0]',
      'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
      'inner-shadow-white',
      'px-5 h-[42px] w-fit'
    ),

    alternate: cn(
      'bg-white text-black',
      'hover:bg-gray-50 active:bg-gray-100',
      'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
      'inner-shadow-white',
      'px-5 h-[42px] w-fit',
      'dark:bg-[#1a1a2e] dark:text-white',
      'dark:hover:bg-[#2a2a3e] dark:active:bg-[#3a3a4e]',
      'dark:shadow-[0_8px_16px_-12px_rgba(0,0,0,0.9),0_12px_16px_-12px_rgba(79,76,240,0.64)]'
    ),

    long: cn(
      'bg-white text-black',
      'hover:bg-gray-50 active:bg-gray-100',
      'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
      'inner-shadow-white',
      'h-[42px] w-full',
      'dark:bg-[#1a1a2e] dark:text-white',
      'dark:hover:bg-[#2a2a3e] dark:active:bg-[#3a3a4e]',
      'dark:shadow-[0_8px_16px_-12px_rgba(0,0,0,0.9),0_12px_16px_-12px_rgba(79,76,240,0.64)]'
    ),

    base: cn(
      'bg-[#1498D7] text-white',
      'hover:bg-[#0E7AB5] active:bg-[#0B5C8A]',
      'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
      'inner-shadow-white',
      'px-5 h-[42px] w-fit'
    ),

    ghost: cn(
      'bg-transparent text-white',
      'hover:bg-white/10 active:bg-white/20',
      'px-5 h-[42px] w-fit',
      'dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20'
    ),

    ghostLong: cn(
      'bg-transparent text-white',
      'hover:bg-white/10 active:bg-white/20',
      'h-[42px] w-full',
      'dark:text-white dark:hover:bg-white/10 dark:active:bg-white/20'
    ),

    hostLong: cn(
      'bg-transparent text-white',
      'border border-white/20',
      'hover:bg-white/10 active:bg-white/20',
      'h-[42px] w-full',
      'dark:text-white'
    ),

    outline: cn(
      'bg-white text-black border border-[#D9D9D9]',
      'hover:bg-gray-50 active:bg-gray-100',
      'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
      'inner-shadow-white',
      'px-5 h-[42px] w-fit',
      'dark:bg-[#1a1a2e] dark:text-white dark:border-[#3a3a4e]',
      'dark:hover:bg-[#2a2a3e] dark:active:bg-[#3a3a4e]',
      'dark:shadow-[0_8px_16px_-12px_rgba(0,0,0,0.9),0_12px_16px_-12px_rgba(79,76,240,0.64)]'
    ),
  }

  const innerShadowStyles = cn(
    'relative',
    'before:content-[""] before:absolute before:inset-0 before:rounded-[8px]',
    'before:pointer-events-none',
    'before:shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.1),inset_0_2px_0_0_rgba(255,255,255,0.25)]'
  )

  const shouldApplyInnerShadow = variant !== 'ghost' && variant !== 'ghostLong' && variant !== 'hostLong'

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        shouldApplyInnerShadow && innerShadowStyles
      )}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default BaseButton