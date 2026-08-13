'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Wordmark } from '@/public/icons/logo'
import ChatButton from './chatButton'
import SidebarItem from './sidebarItem'
import SidebarHead from './sidebarItemHead'
import SidebarProfile from './sidebarProfileItem'
import { useUser } from '@/hooks/use-user'

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
  const router = useRouter()
  const { authenticated } = useUser()
  const [quizHistory, setQuizHistory] = useState<ChatHistoryItem[]>([])

  useEffect(() => {
    if (!authenticated) {
      setQuizHistory([])
      return
    }

    const loadQuizHistory = async () => {
      try {
        const response = await fetch('/api/quizzes')
        if (!response.ok) {
          setQuizHistory([])
          return
        }

        const data = await response.json()
        const items = (data.quizzes ?? []).map((item: any) => ({
          id: item.id,
          title: item.title || 'Untitled quiz',
          href: `/quiz?historyId=${item.id}`,
        }))

        setQuizHistory(items)
      } catch (error) {
        console.error('Failed to load quiz history:', error)
        setQuizHistory([])
      }
    }

    loadQuizHistory()
  }, [authenticated])

  const historyList = authenticated && quizHistory.length > 0 ? quizHistory : chatHistory

  const handleNewQuiz = () => {
    localStorage.removeItem('currentQuiz')
    localStorage.removeItem('currentQuizId')
    router.push('/dashboard')
  }

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
        <ChatButton onClick={handleNewQuiz} />

        <div className="h-5" />

        <div className="flex-1 flex flex-col overflow-y-auto">
          <SidebarHead label="CHAT HISTORY" />

          <div className="h-2" />

          <div className="flex flex-col gap-1">
            {historyList.map((item) => (
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