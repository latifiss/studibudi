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

  const profileRef = useRef<HTMLButtonElement>(null)

  const handleGetStarted = () => {
    router.push('/get-started')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const handleProfileClick = () => {
    setIsProfileOpen((prev) => !prev)
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    setIsProfileOpen(false)
    await logout?.()
  }

  const handleUpgrade = () => {
    setIsProfileOpen(false)
    router.push('/upgrade')
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        const modal = document.getElementById('header-profile-modal')

        if (modal && !modal.contains(event.target as Node)) {
          setIsProfileOpen(false)
        }
      }
    }

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileOpen])

  const displayName = user?.name || user?.email || 'User'
  const userEmail = user?.email || 'user@example.com'

  return (
    <>
      <header className="flex items-center justify-between w-full h-18 px-4 sm:px-9 border-b border-border relative z-50 bg-white">
        <Link
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <Wordmark className="text-foreground" />
        </Link>

        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2">
            <GlobeIcon className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">
              Eng
            </span>
          </div>

          {authenticated ? (
            <button
              ref={profileRef}
              onClick={handleProfileClick}
              className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Open profile"
              aria-expanded={isProfileOpen}
            >
              {user?.image ? (
                <Image
                  width={34}
                  height={34}
                  src={user.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ProfileIcon className="w-5 h-5 text-[#333333]" />
                </div>
              )}
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
              >
                Login
              </Link>

              <BaseButton
                variant="outline"
                onClick={handleGetStarted}
                className="text-sm"
              >
                Get Started
              </BaseButton>
            </>
          )}
        </div>

        <div className="flex sm:hidden items-center gap-4">
          <div className="flex items-center gap-1">
            <GlobeIcon className="text-foreground w-4 h-4" />
            <span className="text-sm font-semibold text-foreground">
              En
            </span>
          </div>

          {authenticated ? (
            <button
              ref={profileRef}
              onClick={handleProfileClick}
              className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center hover:opacity-70 transition-opacity focus:outline-none"
              aria-label="Open profile"
              aria-expanded={isProfileOpen}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#F5F5F5] flex items-center justify-center">
                  <ProfileIcon className="w-4 h-4 text-[#333333]" />
                </div>
              )}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
            >
              Login
            </Link>
          )}

          {!authenticated && (
            <button
              onClick={toggleMenu}
              className="p-1 hover:opacity-70 transition-opacity"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>
          )}
        </div>
      </header>

      {isMenuOpen && !authenticated && (
        <div className="sm:hidden fixed top-18 left-0 right-0 bg-white border-b border-border z-40 px-4 py-6 shadow-lg">
          <div className="flex flex-col items-center gap-4">
            <BaseButton
              variant="outline"
              onClick={handleGetStarted}
              className="text-sm w-full max-w-50"
            >
              Get Started
            </BaseButton>
          </div>
        </div>
      )}

      {authenticated && (
        <div id="header-profile-modal">
          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            tier="free"
            onLogout={handleLogout}
            onUpgrade={handleUpgrade}
            userEmail={userEmail}
            userName={displayName}
            anchorRef={profileRef}
          />
        </div>
      )}
    </>
  )
}

export default Header
