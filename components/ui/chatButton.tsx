import React from 'react'
import { cn } from '@/lib/utils'
import { ChatIcon } from '@/public/icons/mono'

interface ChatButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  className?: string
  disabled?: boolean
}

const ChatButton = ({
  onClick,
  className,
  disabled = false,
  ...props
}: ChatButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        'font-text text-[13px] font-bold leading-4.5 tracking-normal',
        'rounded-lg px-5 h-11 w-full max-w-70',
        'bg-white text-black border border-[#D9D9D9]',
        'hover:bg-gray-50 active:bg-gray-100',
        'shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]',
        'transition-all duration-200 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F4CF0]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'dark:bg-[#1a1a2e] dark:text-white dark:border-[#3a3a4e]',
        'dark:hover:bg-[#2a2a3e] dark:active:bg-[#3a3a4e]',
        'dark:shadow-[0_2px_8px_-4px_rgba(0,0,0,0.3)]',
        className
      )}
      {...props}
    >
      <ChatIcon className="w-5 h-5 text-black dark:text-white" />
      <span>new quiz</span>
    </button>
  )
}

export default ChatButton