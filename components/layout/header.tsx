'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import BaseButton from '@/components/ui/baseButton'
import { Wordmark } from '@/public/icons/logo'
import { GlobeIcon, ProfileIcon } from '@/public/icons/mono'
import { useUser } from '@/hooks/use-user'
import ProfileModal from '@/components/ui/profileModal'
import Image from 'next/image'

const Header = () => {
  const router = useRouter()
  const { user, authenticated, logout } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [tier, setTier] = useState<'free' | 'pro'>('free')
  const profileRef = useRef<HTMLButtonElement>(null)

  const refreshEntitlements = async () => {
    if (!authenticated) {
      setTier('free')
      return false
    }
    try {
      const response = await fetch('/api/billing/entitlements', { cache: 'no-store' })
      if (!response.ok) return false
      const data = await response.json()
      const isPro = Boolean(data?.isPro)
      setTier(isPro ? 'pro' : 'free')
      return isPro
    } catch {
      return false
    }
  }

  useEffect(() => {
    refreshEntitlements()
  }, [authenticated])

  useEffect(() => {
    if (!authenticated) return
    let cancelled = false
    let attempts = 0
    const poll = async () => {
      if (cancelled) return
      attempts += 1
      const isPro = await refreshEntitlements()
      if (!isPro && attempts < 12) window.setTimeout(poll, 1500)
    }
    poll()
    return () => {
      cancelled = true
    }
  }, [authenticated])

  const handleGetStarted = () => {
    router.push('/get-started')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    setIsProfileOpen((prev) => !prev)
    setIsMenuOpen(false)
    refreshEntitlements()
  }

  const handleLogout = async () => {
    await logout?.()
  }

  const handleUpgrade = () => {
    router.push('/upgrade')
  }

  const handleCancel = () => {
    router.push('/cancel')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      const anchor = profileRef.current
      const modal = document.getElementById('profile-modal')

      if (anchor?.contains(target) || modal?.contains(target)) return
      setIsProfileOpen(false)
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isProfileOpen])

  const displayName = user?.name || user?.email || 'User'
  const userEmail = user?.email || 'user@example.com'
  const userImage = user?.image || undefined

  return (
    <>
      <header className="flex items-center justify-between w-full h-18 px-4 sm:px-9 border-b border-border relative z-50 bg-white">
        <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity" aria-label="Go to home">
          <Wordmark className="text-foreground" />
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <GlobeIcon className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Eng</span>
          </div>

          {authenticated ? (
            <button
              ref={profileRef}
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Open profile"
              aria-expanded={isProfileOpen}
            >
              {userImage ? (
                <Image width={34} height={34} src={userImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ProfileIcon className="w-5 h-5 text-[#333333]" />
                </div>
              )}
            </button>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity">Login</Link>
              <BaseButton variant="outline" onClick={handleGetStarted} className="text-sm">Get Started</BaseButton>
            </>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-4">
          <div className="flex items-center gap-1">
            <GlobeIcon className="text-foreground w-4 h-4" />
            <span className="text-sm font-semibold text-foreground">En</span>
          </div>

          {authenticated ? (
            <button
              ref={profileRef}
              onClick={handleProfileClick}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Open profile"
              aria-expanded={isProfileOpen}
            >
              {userImage ? (
                <img src={userImage} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ProfileIcon className="w-4 h-4 text-[#333333]" />
                </div>
              )}
            </button>
          ) : (
            <Link href="/login" className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity">Login</Link>
          )}

          {!authenticated && (
            <button onClick={toggleMenu} className="p-1 hover:opacity-70 transition-opacity" aria-label="Toggle menu">
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          )}
        </div>
      </header>

      {isMenuOpen && !authenticated && (
        <div className="sm:hidden fixed top-18 left-0 right-0 bg-white border-b border-border z-40 px-4 py-6 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <BaseButton variant="outline" onClick={handleGetStarted} className="text-sm w-full max-w-50">Get Started</BaseButton>
          </div>
        </div>
      )}

      {authenticated && (
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          tier={tier}
          onLogout={handleLogout}
          onUpgrade={handleUpgrade}
          onCancel={tier === 'pro' ? handleCancel : undefined}
          userEmail={userEmail}
          userName={displayName}
          userImage={userImage}
          anchorRef={profileRef}
        />
      )}
    </>
  )
}

export default Header
