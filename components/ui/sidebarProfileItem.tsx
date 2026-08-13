import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProfileIcon } from '@/public/icons/mono'

interface SidebarProfileProps {
  loginHref?: string
  signupHref?: string
  className?: string
}

const SidebarProfile = ({
  loginHref = '/login',
  signupHref = '/signin',
  className,
  ...props
}: SidebarProfileProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 w-full h-19 px-4 sm:px-5',
        'border-t border-[#E5E5E5] dark:border-[#2a2a3e]',
        'bg-transparent',
        'transition-colors duration-200',
        className
      )}
      {...props}
    >
      <ProfileIcon className="shrink-0 text-[#333333] dark:text-white" />
      
      <div className="flex items-center gap-1 font-text text-[14px] leading-auto text-[#333333] dark:text-white">
        <Link
          href={loginHref}
          className="hover:opacity-70 transition-opacity"
        >
          Login
        </Link>
        <span className="text-[#B5B5B5] dark:text-[#6B6B6B]">/</span>
        <Link
          href={signupHref}
          className="hover:opacity-70 transition-opacity"
        >
          Signup
        </Link>
      </div>
    </div>
  )
}

export default SidebarProfile