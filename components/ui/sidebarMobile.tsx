'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import Sidebar from '@/components/ui/sidebar'
import { CloseIcon } from '@/public/icons/mono'

interface SidebarMobileProps {
  isOpen: boolean
  onClose: () => void
}

const SidebarMobile = ({ isOpen, onClose }: SidebarMobileProps) => {
  return (
    <>
      <div
        className={cn(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          'fixed inset-0 w-full h-dvh z-50 lg:hidden overflow-hidden',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[70] p-1 hover:opacity-70 transition-opacity"
          aria-label="Close sidebar"
        >
          <CloseIcon className="w-6 h-6 text-foreground" />
        </button>

        <Sidebar className="w-full" />
      </div>
    </>
  )
}

export default SidebarMobile