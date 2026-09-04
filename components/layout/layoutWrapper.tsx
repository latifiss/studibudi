'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Header from './header'
import AltHeader from './altHeader'
import SidebarWrapper from './sidebarWrapper'
import CookieBanner from '../ui/cookieBanner'

const allowedRoutes = [
  '/',
  '/login',
  '/signin',
  '/auth/success',
  '/not-found',
  '/terms',
  '/privacy',
  '/refund',
  '/cookie',
  '/upgrade',
  '/cancel',
  '/cancel/success',
  '/cancel/failed',
  '/cancel/confirm',
  '/pro',
  '/quiz',
  '/home',
  '/profile',
  '/dashboard',
]

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const isAllowedRoute = allowedRoutes.includes(pathname)

  useEffect(() => {
    if (!isAllowedRoute) router.replace('/not-found')
  }, [isAllowedRoute, router])

  if (!isAllowedRoute) return null

  const hideSidebar =
    pathname === '/login' || pathname === '/signin' || pathname === '/auth/success' ||
    pathname === '/not-found' || pathname === '/terms' || pathname === '/privacy' ||
    pathname === '/refund' || pathname === '/cookie' || pathname === '/upgrade' ||
    pathname === '/cancel' || pathname === '/cancel/success' || pathname === '/cancel/failed' ||
    pathname === '/cancel/confirm' || pathname === '/pro' || pathname === '/quiz' ||
    pathname === '/home' || pathname === '/'

  const hideHeader =
    pathname === '/login' || pathname === '/signin' || pathname === '/auth/success' ||
    pathname === '/not-found' || pathname === '/pro' || pathname === '/upgrade' ||
    pathname === '/cancel/success' || pathname === '/cancel/failed' || pathname === '/cancel/confirm' ||
    pathname === '/cancel' || pathname === '/quiz' || pathname === '/dashboard'

  const showAltHeader = pathname === '/profile'

  return (
    <div className="flex flex-1 h-full min-w-0 overflow-hidden">
      {!hideSidebar && (
        <div className="hidden lg:block w-70 h-full shrink-0 overflow-hidden">
          <SidebarWrapper />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden">
        <div className="flex-1 min-w-0 overflow-y-auto main-scroll-container scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground">
          {!hideHeader && (
            <div className="sticky top-0 z-50">
              {showAltHeader ? <AltHeader /> : <Header />}
            </div>
          )}

          {children}

          <CookieBanner onAccept={() => console.log('Cookies accepted')} onReject={() => console.log('Cookies rejected')} />
        </div>
      </div>
    </div>
  )
}
