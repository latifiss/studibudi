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
  onNewQuiz?: () => void
}

const Sidebar = ({ className, onNewQuiz, ...props }: SidebarProps) => {
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
        const response = await fetch('/api/quizzes', { cache: 'no-store' })
        if (!response.ok) {
          setQuizHistory([])
          return
        }
        const data = await response.json()
        setQuizHistory((data.quizzes ?? []).map((item: { id: string; title?: string }) => ({
          id: item.id,
          title: item.title || 'Untitled quiz',
          href: `/quiz?historyId=${item.id}`,
        })))
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
    if (onNewQuiz) {
      onNewQuiz()
      return
    }
    window.dispatchEvent(new Event('studibudi:open-upload'))
    router.push('/dashboard')
  }

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 flex flex-col h-dvh min-h-0 py-0',
        'bg-background border-r border-border',
        'transition-colors duration-200',
        'overflow-hidden',
        className || 'w-70'
      )}
      {...props}
    >
      <div className="shrink-0 flex items-center justify-start w-full h-18 px-3 bg-transparent">
        <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity" aria-label="Go to home">
          <Wordmark className="text-foreground" />
        </Link>
      </div>

      <div className="shrink-0 h-4" />

      <div className="flex flex-col min-h-0 flex-1 px-4 sm:px-5">
        <div className="shrink-0">
          <ChatButton onClick={handleNewQuiz} />
          <div className="h-5" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground">
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
                      className="max-lg:-mx-4 max-lg:w-[calc(100%+2rem)] max-lg:px-4 sm:max-lg:-mx-5 sm:max-lg:w-[calc(100%+2.5rem)] sm:max-lg:px-5"
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

      <div className="shrink-0">
        <SidebarProfile />
      </div>
    </aside>
  )
}

export default Sidebar