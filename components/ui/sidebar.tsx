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
  className?: string
}

const Sidebar = ({
  className,
  ...props
}: SidebarProps) => {
  const router = useRouter()
  const { authenticated } = useUser()
  const [quizHistory, setQuizHistory] = useState<ChatHistoryItem[]>([])

  useEffect(() => {
    if (!authenticated) {
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
        const items = (data.quizzes ?? []).map((item: { id: string; title?: string }) => ({
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
          {authenticated ? (
            <>
              <SidebarHead label="QUIZ HISTORY" />
              <div className="h-2" />
              {quizHistory.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {quizHistory.map((item) => (
                    <SidebarItem
                      key={item.id}
                      href={item.href}
                      label={item.title}
                      active={item.active}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground px-2 py-4 text-left">
                  Your past quizzes will appear here
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>

      <SidebarProfile />
    </aside>
  )
}

export default Sidebar