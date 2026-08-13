'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ProfileIcon } from '@/public/icons/mono'
import { useUser } from '@/hooks/use-user'
import ProfileModal from '@/components/ui/profileModal'

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
  const { user, authenticated, logout } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  
  const displayName = user?.name || user?.email || 'Profile'
  const userEmail = user?.email || 'user@example.com'
  const userName = user?.name || 'User'
  const userTier = 'free' //TODO: Payment and user tier management

  const handleLogout = () => {
    logout?.()
    setIsModalOpen(false)
  }

  const handleUpgrade = () => {
    window.location.href = '/upgrade'
    setIsModalOpen(false)
  }

  const handleProfileClick = () => {
    if (authenticated) {
      setIsModalOpen(!isModalOpen)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsModalOpen(false)
      }
    }

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isModalOpen])

  return (
    <>
      <div
        ref={profileRef}
        className={cn(
          'relative flex items-center gap-2 w-full h-19 px-4 sm:px-5',
          'border-t border-[#E5E5E5] dark:border-[#2a2a3e]',
          'bg-transparent',
          'transition-colors duration-200',
          className
        )}
        {...props}
      >
        <ProfileIcon className="shrink-0 text-[#333333] dark:text-white" />

        {authenticated ? (
          <button
            onClick={handleProfileClick}
            className="flex min-w-0 items-center font-text text-[14px] leading-auto text-[#333333] dark:text-white hover:opacity-70 transition-opacity flex-1 text-left"
          >
            <span className="truncate" title={displayName}>
              {displayName}
            </span>
          </button>
        ) : (
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
        )}

        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          tier={userTier}
          onLogout={handleLogout}
          onUpgrade={handleUpgrade}
          userEmail={userEmail}
          userName={userName}
          anchorRef={profileRef}
        />
      </div>
    </>
  )
}

export default SidebarProfile