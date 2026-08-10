'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { CloseIcon, BulbIcon, PdfChipIcon, PptChipIcon, DocChipIcon } from '@/public/icons/mono'

interface ExplanationProps {
  isOpen: boolean
  onClose: () => void
  explanation: string
  fileType?: 'pdf' | 'ppt' | 'doc'
  className?: string
  isSidebar?: boolean
}

const Explanation = ({
  isOpen,
  onClose,
  explanation,
  fileType = 'pdf',
  className,
  isSidebar = false,
  ...props
}: ExplanationProps) => {
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle body scroll lock (only on mobile)
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isMobile])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Get the appropriate chip icon
  const getChipIcon = () => {
    switch (fileType) {
      case 'pdf':
        return <PdfChipIcon size={24} />
      case 'ppt':
        return <PptChipIcon size={24} />
      case 'doc':
        return <DocChipIcon size={24} />
      default:
        return <DocChipIcon size={24} />
    }
  }

  // Split explanation into paragraphs
  const paragraphs = explanation.split('\n').filter(p => p.trim() !== '')

  // Content component (shared between sidebar and bottom sheet)
  const Content = () => (
    <div className={cn(
      'flex flex-col h-full',
      isMobile ? 'p-4 pb-6' : 'p-7'
    )}>
      {/* Header with CloseIcon - Sticky */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="flex items-center justify-start h-[37px] bg-transparent shrink-0">
          <button
            onClick={onClose}
            className="cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Close explanation"
          >
            <CloseIcon className="text-black" />
          </button>
        </div>

        {/* 22px spacing */}
        <div className="h-[22px] shrink-0" />

        {/* BulbIcon + Explanation header */}
        <div className="shrink-0">
          <div
            className="flex items-center gap-[3px] h-[34px] px-2 rounded-[8px] bg-white border-[1.5px] border-transparent w-fit"
            style={{
              backgroundImage: 'linear-gradient(white, white), radial-gradient(circle at 50% 50%, #FADF73, #FFD500, #FC9900)',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
          >
            <BulbIcon size={22} />
            <span 
              className="font-text text-[13px] font-medium bg-clip-text text-transparent"
              style={{
                backgroundImage: 'radial-gradient(circle at 50% 50%, #FADF73, #FFD500, #FC9900)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Explanation
            </span>
          </div>
        </div>

        {/* 37px spacing */}
        <div className="h-[37px] shrink-0" />
      </div>

      {/* Explanation Content - Scrollable with custom scrollbar */}
      <div className={cn(
        'flex-1 overflow-y-auto pb-4',
        // Hide scrollbar on mobile
        isMobile && 'scrollbar-hide',
        // Nice scrollbar on desktop/tablet
        !isMobile && 'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#E5E5E5] hover:scrollbar-thumb-[#D0D0D0]'
      )}>
        <div className="flex flex-col gap-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="font-text text-[#4B4B4B] text-[17px] leading-[26.6px] tracking-normal text-left">
              {paragraph}
              <span className="inline-block ml-2 align-middle">
                {getChipIcon()}
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  )

  // Sidebar mode (desktop/tablet) - with smooth animation
  if (isSidebar && !isMobile) {
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 300,
              duration: 0.4,
            }}
            className={cn(
              'relative z-40 bg-white w-full max-w-[579px] h-screen',
              'border-l-2 border-[#E5E5E5]',
              className
            )}
            {...props}
          >
            <Content />
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  // Mobile: Bottom sheet with smooth animation (no border radius)
  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Overlay - with fade animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40"
            onClick={onClose}
          />

          {/* Bottom Sheet - no border radius on mobile */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 350,
              duration: 0.4,
            }}
            className={cn(
              'fixed z-50 bg-white',
              'bottom-0 left-0 right-0',
              'max-h-[85vh]',
              className
            )}
            {...props}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-12 h-1 rounded-full bg-[#E5E5E5]" />
            </div>

            <Content />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Explanation