'use client'

import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { ProfileIcon } from '@/public/icons/mono'
import Image from 'next/image'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  tier: 'free' | 'pro'
  onLogout: () => void | Promise<void>
  onUpgrade?: () => void
  onCancel?: () => void | Promise<void>
  userEmail?: string
  userName?: string
  userImage?: string
  anchorRef?: React.RefObject<HTMLElement | null>
}

const ProfileModal = ({
  isOpen,
  onClose,
  tier,
  onLogout,
  onUpgrade,
  onCancel,
  userEmail,
  userName,
  userImage,
  anchorRef,
}: ProfileModalProps) => {
  const [position, setPosition] = useState({ top: 0, right: 12 })
  const [isCancelling, setIsCancelling] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [liveTier, setLiveTier] = useState<'free' | 'pro'>(tier)
  const [mounted, setMounted] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    setLiveTier(tier)
  }, [tier])

  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      const anchor = anchorRef?.current
      const modal = modalRef.current
      if (!anchor) return

      const rect = anchor.getBoundingClientRect()
      const modalHeight = modal?.getBoundingClientRect().height ?? 210
      const gap = 8

      // Header profiles have room below. Sidebar profiles live at the
      // bottom of the viewport, so place the modal above them when needed.
      const spaceBelow = window.innerHeight - rect.bottom
      const top = spaceBelow >= modalHeight + gap
        ? rect.bottom + gap
        : Math.max(8, rect.top - modalHeight - gap)

      setPosition({
        top,
        right: Math.max(12, window.innerWidth - rect.right),
      })
    }

    updatePosition()
    const frame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, anchorRef])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (anchorRef?.current?.contains(target)) return
      if (modalRef.current?.contains(target)) return
      onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, anchorRef, onClose])

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    const refreshTier = async () => {
      try {
        const response = await fetch('/api/billing/entitlements', { cache: 'no-store' })
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled) setLiveTier(data?.isPro ? 'pro' : 'free')
      } catch {}
    }

    refreshTier()
    return () => {
      cancelled = true
    }
  }, [isOpen])

  if (!isOpen || !mounted) return null

  const tierLabel = liveTier === 'free' ? 'Free' : 'Pro'
  const tierColor = liveTier === 'free' ? 'text-[#737373]' : 'text-[#4F4CF0]'

  const handleCancel = async () => {
    if (!onCancel || isCancelling) return
    setIsCancelling(true)
    try {
      await onCancel()
    } catch (error) {
      console.error('Unable to open cancellation flow:', error)
      setIsCancelling(false)
    }
  }

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    try {
      await onLogout()
    } catch (error) {
      console.error('Logout failed:', error)
      setIsLoggingOut(false)
    }
  }

  return createPortal(
    <div
      ref={modalRef}
      data-profile-modal="true"
      className="fixed z-[9999] w-70"
      style={{ top: position.top, right: position.right }}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className={cn(
          'bg-white dark:bg-[#1a1a2e] rounded-2xl w-full',
          'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]',
          'relative overflow-hidden',
          'border border-[#E5E5E5] dark:border-[#2a2a3e]'
        )}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2a2a3e]">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] dark:bg-[#2a2a3e] flex items-center justify-center overflow-hidden shrink-0">
            {userImage ? (
              <Image src={userImage} alt={userName || 'User'} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <ProfileIcon className="w-5 h-5 text-[#333333] dark:text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-text text-[14px] font-semibold text-[#333333] dark:text-white truncate">{userName || 'User'}</p>
            <p className="font-text text-[12px] text-[#737373] dark:text-[#9CA3AF] truncate">{userEmail || 'user@example.com'}</p>
          </div>
        </div>

        <div className="py-2">
          <button
            onClick={liveTier === 'free' ? onUpgrade : undefined}
            className={cn(
              'flex items-center justify-between w-full px-5 h-13.5',
              'hover:bg-gray-50 dark:hover:bg-white/5',
              'transition-colors duration-200',
              'font-text text-[14px] font-medium',
              liveTier === 'pro' && 'cursor-default'
            )}
          >
            <span className="text-[#333333] dark:text-white">Current Plan</span>
            <span className={cn('font-semibold', tierColor)}>{tierLabel}</span>
          </button>

          {liveTier === 'pro' && onCancel && (
            <button
              onClick={handleCancel}
              disabled={isCancelling}
              className={cn(
                'flex items-center w-full px-5 h-13.5',
                'hover:bg-gray-50 dark:hover:bg-white/5',
                'transition-colors duration-200',
                'font-text text-[14px] font-medium text-[#FE1212] disabled:opacity-50'
              )}
            >
              {isCancelling ? 'Opening...' : 'Cancel subscription'}
            </button>
          )}

          <div className="h-px bg-[#E5E5E5] dark:bg-[#2a2a3e] mx-5" />

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              'flex items-center w-full px-5 h-13.5',
              'hover:bg-gray-50 dark:hover:bg-white/5',
              'transition-colors duration-200',
              'font-text text-[14px] font-medium text-[#FE1212] disabled:opacity-50'
            )}
          >
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ProfileModal
