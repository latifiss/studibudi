import React from 'react'
import { cn } from '@/lib/utils'

interface SidebarHeadProps {
  label: string
  className?: string
}

const SidebarHead = ({
  label,
  className,
  ...props
}: SidebarHeadProps) => {
  return (
    <div
      className={cn(
        'w-full px-2 py-0',
        'font-text text-[10px] leading-auto',
        'bg-transparent text-[#B5B5B5] dark:text-[#6B6B6B]',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      {label}
    </div>
  )
}

export default SidebarHead