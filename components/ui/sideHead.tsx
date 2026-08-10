import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Wordmark } from '@/public/icons/logo'

interface SideHeadProps {
  className?: string
}

const SideHead = ({
  className,
  ...props
}: SideHeadProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-start w-full h-18 px-3',
        'bg-transparent',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      <Link 
        href="/"
        className="cursor-pointer hover:opacity-70 transition-opacity"
        aria-label="Go to home"
      >
        <Wordmark className="text-foreground" />
      </Link>
    </div>
  )
}

export default SideHead