'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Wordmark } from '@/public/icons/logo'
import ChatButton from './chatButton'
import SidebarItem from './sidebarItem'
import SidebarHead from './sidebarItemHead'
import SidebarProfile from './sidebarProfileItem'

interface ChatHistoryItem {
  id: string
  title: string
  href: string
  active?: boolean
}

interface SidebarProps {
  chatHistory?: ChatHistoryItem[]
  className?: string
}

const defaultChatHistory: ChatHistoryItem[] = [
  { id: '1', title: 'How to build a React app', href: '/chat/1' },
  { id: '2', title: 'Understanding Next.js 14', href: '/chat/2' },
  { id: '3', title: 'Tailwind CSS best practices', href: '/chat/3' },
  { id: '4', title: 'API routes in Next.js', href: '/chat/4' },
  { id: '5', title: 'Deploying to Vercel', href: '/chat/5' },
  { id: '6', title: 'Authentication with NextAuth', href: '/chat/6' },
]

const Sidebar = ({
  chatHistory = defaultChatHistory,
  className,
  ...props
}: SidebarProps) => {
  return (
    <aside
      className={cn(
        'flex flex-col h-screen max-h-screen py-0',
        'bg-background border-r border-border',
        'transition-colors duration-200',
        'overflow-y-auto',
        'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground',
        'max-lg:scrollbar-hide',
        className || 'w-70'
      )}
      {...props}
    >
      <div
        className={cn(
          'flex items-center justify-start w-full h-18 px-3',
          'bg-transparent',
          'transition-colors duration-200'
        )}
      >
        <Link 
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <Wordmark className="text-foreground" />
        </Link>
      </div>

      <div className="h-4" />

      <div className="flex flex-col px-4 sm:px-5 flex-1">
        <ChatButton onClick={() => console.log('New chat')} />

        <div className="h-5" />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <SidebarHead label="CHAT HISTORY" />

          <div className="h-2" />

          <div className="flex flex-col gap-1">
            {chatHistory.map((item) => (
              <SidebarItem
                key={item.id}
                href={item.href}
                label={item.title}
                active={item.active}
              />
            ))}
          </div>
        </div>
      </div>

      <SidebarProfile />
    </aside>
  )
}

export default Sidebar