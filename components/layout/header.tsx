'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu } from 'lucide-react'
import BaseButton from '@/components/ui/baseButton'
import { Wordmark } from '@/public/icons/logo'
import { GlobeIcon } from '@/public/icons/mono'

const Header = () => {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleGetStarted = () => {
    router.push('/get-started')
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <header className='flex items-center justify-between w-full h-18 px-4 sm:px-9 border-b border-border relative z-50 bg-white'>
        <Link 
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <Wordmark className="text-foreground" />
        </Link>

        <div className='hidden sm:flex items-center gap-6'>
          <Link 
            href="/language"
            className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <GlobeIcon className="text-foreground" />
            <span className="text-sm font-semibold text-foreground">Eng</span>
          </Link>

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
        </div>

        <div className='flex sm:hidden items-center gap-4'>
          <Link 
            href="/language"
            className="flex items-center gap-1 cursor-pointer hover:opacity-70 transition-opacity"
          >
            <GlobeIcon className="text-foreground w-4 h-4" />
            <span className="text-sm font-semibold text-foreground">En</span>
          </Link>

          <Link 
            href="/login"
            className="text-sm font-semibold text-foreground hover:opacity-70 transition-opacity"
          >
            Login
          </Link>

          <button
            onClick={toggleMenu}
            className="p-1 hover:opacity-70 transition-opacity"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
        </div>
      </header>

      {isMenuOpen && (
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
    </>
  )
}

export default Header