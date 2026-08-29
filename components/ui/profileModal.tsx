'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { ProfileIcon } from '@/public/icons/mono'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  tier: 'free' | 'pro'
  onLogout: () => void
  onUpgrade?: () => void
  onCancel?: () => Promise<void> | void
  userEmail?: string
  userName?: string
  anchorRef?: React.RefObject<HTMLElement | null>
}

const ProfileModal = ({ isOpen, onClose, tier, onLogout, onUpgrade, onCancel, userEmail, userName, anchorRef }: ProfileModalProps) => {
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const [isCancelling, setIsCancelling] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return
    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({ top: rect.bottom + 8, right: Math.max(12, window.innerWidth - rect.right) })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, anchorRef])

  if (!isOpen) return null

  const tierLabel = tier === 'free' ? 'Free' : 'Pro'
  const tierColor = tier === 'free' ? 'text-[#737373]' : 'text-[#4F4CF0]'

  const handleCancel = async () => {
    if (!onCancel || isCancelling) return
    const confirmed = window.confirm('Cancel your Pro subscription? You will keep Pro access until the end of your current billing period.')
    if (!confirmed) return
    setIsCancelling(true)
    try { await onCancel(); onClose() } finally { setIsCancelling(false) }
  }

  return (
    <div ref={modalRef} className="fixed z-[60] w-70" style={{ top: position.top, right: position.right }}>
      <div className={cn('bg-white dark:bg-[#1a1a2e] rounded-2xl w-full', 'shadow-[0_8px_16px_-12px_rgba(0,0,0,0.8),0_12px_16px_-12px_rgba(79,76,240,0.64)]', 'relative overflow-hidden', 'border border-[#E5E5E5] dark:border-[#2a2a3e]')}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#E5E5E5] dark:border-[#2a2a3e]">
          <div className="w-10 h-10 rounded-full bg-[#F5F5F5] dark:bg-[#2a2a3e] flex items-center justify-center overflow-hidden"><ProfileIcon className="w-5 h-5 text-[#333333] dark:text-white" /></div>
          <div className="flex-1 min-w-0">
            <p className="font-text text-[14px] font-semibold text-[#333333] dark:text-white truncate">{userName || 'User'}</p>
            <p className="font-text text-[12px] text-[#737373] dark:text-[#9CA3AF] truncate">{userEmail || 'user@example.com'}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close profile" className="text-[#737373] hover:text-[#333333] dark:hover:text-white text-xl leading-none">×</button>
        </div>

        <div className="py-2">
          <button onClick={onUpgrade} className={cn('flex items-center justify-between w-full px-5 h-13.5', 'hover:bg-gray-50 dark:hover:bg-white/5', 'transition-colors duration-200', 'font-text text-[14px] font-medium')}>
            <span className="text-[#333333] dark:text-white">Current Plan</span>
            <span className={cn('font-semibold', tierColor)}>{tierLabel}</span>
          </button>

          {tier === 'pro' && onCancel && (
            <button onClick={handleCancel} disabled={isCancelling} className={cn('flex items-center w-full px-5 h-13.5', 'hover:bg-gray-50 dark:hover:bg-white/5', 'transition-colors duration-200', 'font-text text-[14px] font-medium text-[#FE1212] disabled:opacity-50')}>
              {isCancelling ? 'Cancelling...' : 'Cancel subscription'}
            </button>
          )}

          <div className="h-px bg-[#E5E5E5] dark:bg-[#2a2a3e] mx-5" />

          <button onClick={onLogout} className={cn('flex items-center w-full px-5 h-13.5', 'hover:bg-gray-50 dark:hover:bg-white/5', 'transition-colors duration-200', 'font-text text-[14px] font-medium', 'text-[#FE1212]')}>Logout</button>
        </div>
      </div>
    </div>
  )
}

export default ProfileModal
