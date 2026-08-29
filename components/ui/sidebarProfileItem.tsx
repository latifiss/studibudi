'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { ProfileIcon } from '@/public/icons/mono'
import { useUser } from '@/hooks/use-user'
import ProfileModal from '@/components/ui/profileModal'

interface SidebarProfileProps {
  loginHref?: string
  signupHref?: string
  className?: string
}

const SidebarProfile = ({ loginHref = '/login', signupHref = '/signin', className, ...props }: SidebarProfileProps) => {
  const { user, authenticated, logout } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tier, setTier] = useState<'free' | 'pro'>('free')
  const profileRef = useRef<HTMLDivElement>(null)

  const displayName = user?.name || user?.email || 'Profile'
  const userEmail = user?.email || 'user@example.com'
  const userName = user?.name || 'User'

  const refreshTier = async () => {
    if (!authenticated) { setTier('free'); return }
    try {
      const response = await fetch('/api/billing/entitlements', { cache: 'no-store' })
      if (!response.ok) return
      const data = await response.json()
      setTier(data?.isPro ? 'pro' : 'free')
    } catch {}
  }

  useEffect(() => { refreshTier() }, [authenticated])
  useEffect(() => { if (isModalOpen) refreshTier() }, [isModalOpen])

  const handleLogout = async () => { await logout?.() }
  const handleUpgrade = () => { window.location.href = '/upgrade' }
  const handleCancel = () => { window.location.href = '/cancel' }

  const handleProfileClick = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    if (!authenticated) return
    setIsModalOpen((open) => !open)
  }

  return (
    <div ref={profileRef} className={cn('flex items-center gap-2 w-full h-19 px-4 sm:px-5 border-t border-[#E5E5E5] dark:border-[#2a2a3e] bg-transparent transition-colors duration-200', className)} {...props}>
      {authenticated ? (
        <button type="button" onClick={handleProfileClick} className="shrink-0 w-7 h-7 rounded-full overflow-hidden flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none" aria-label="Open profile" aria-expanded={isModalOpen}>
          {user?.image ? <Image src={user.image} alt={displayName} width={28} height={28} className="w-full h-full object-cover" /> : <div className="w-full h-full rounded-full bg-[#F5F5F5] flex items-center justify-center"><ProfileIcon className="w-4 h-4 text-[#333333]" /></div>}
        </button>
      ) : <ProfileIcon className="shrink-0 text-[#333333] dark:text-white" />}

      {authenticated ? (
        <button type="button" onClick={handleProfileClick} className="flex min-w-0 items-center font-text text-[16px] font-semibold leading-auto text-[#333333] dark:text-white hover:opacity-70 transition-opacity flex-1 text-left">
          <span className="truncate" title={displayName}>{displayName}</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 font-text text-[16px] font-semibold leading-auto text-[#333333] dark:text-white">
          <Link href={loginHref} className="hover:opacity-70 transition-opacity">Login</Link>
          <span className="text-[#B5B5B5] dark:text-[#6B6B6B]">/</span>
          <Link href={signupHref} className="hover:opacity-70 transition-opacity">Signup</Link>
        </div>
      )}

      <ProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={tier}
        onLogout={handleLogout}
        onUpgrade={handleUpgrade}
        onCancel={tier === 'pro' ? handleCancel : undefined}
        userEmail={userEmail}
        userName={userName}
        userImage={user?.image || undefined}
        anchorRef={profileRef}
        placement="sidebar"
      />
    </div>
  )
}

export default SidebarProfile
