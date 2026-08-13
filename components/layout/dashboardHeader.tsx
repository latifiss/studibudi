'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Wordmark } from '@/public/icons/logo'
import { ChatIcon } from '@/public/icons/mono'
import SidebarMobile from '@/components/ui/sidebarMobile'

const DashboardHeader = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <>
      <header className='lg:hidden flex items-center justify-between w-full h-18 px-4 border-b border-border bg-white relative z-50'>
        {/* Menu Button - Left */}
        <button
          onClick={toggleSidebar}
          className="p-1 hover:opacity-70 transition-opacity"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        {/* Wordmark - Center */}
        <Link 
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <Wordmark className="text-foreground" />
        </Link>

        {/* New Chat Button - Right */}
        <button
          onClick={() => console.log('New chat')}
          className="flex items-center justify-center w-9 h-9 rounded-full border border-border hover:bg-gray-50 transition-colors"
          aria-label="New chat"
        >
          <ChatIcon className="w-5 h-5 text-foreground" />
        </button>
      </header>

      {/* Mobile Sidebar */}
      <SidebarMobile isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  )
}

export default DashboardHeader