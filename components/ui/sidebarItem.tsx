import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  icon?: React.ReactNode
  label: string
  href: string
  active?: boolean
  onClick?: () => void
  className?: string
}

const SidebarItem = ({
  icon,
  label,
  href,
  active = false,
  onClick,
  className,
  ...props
}: SidebarItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full h-8 px-2 rounded-lg',
        'font-text text-[14px] leading-auto',
        'bg-transparent text-[#333333] dark:text-white',
        'transition-all duration-200 ease-in-out',
        'hover:bg-gray-100 dark:hover:bg-white/10',
        active && 'bg-gray-100 dark:bg-white/10 font-medium',
        className
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-[#333333] dark:text-white">
          {icon}
        </span>
      )}
      <span>{label}</span>
    </Link>
  )
}

export default SidebarItem