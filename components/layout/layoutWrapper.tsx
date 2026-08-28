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
  '/not-found',
  '/terms',
  '/privacy',
  '/refund-policy',
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

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const isAllowedRoute = allowedRoutes.includes(pathname)

  useEffect(() => {
    if (!isAllowedRoute) {
      router.replace('/not-found')
    }
  }, [isAllowedRoute, router])

  // Don't render the unknown page while redirecting
  if (!isAllowedRoute) {
    return null
  }

  const hideSidebar =
    pathname === '/login' ||
    pathname === '/signin' ||
    pathname === '/not-found' ||
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/refund-policy' ||
    pathname === '/cookie' ||
    pathname === '/upgrade' ||
    pathname === '/cancel' ||
    pathname === '/cancel/success' ||
    pathname === '/cancel/failed' ||
    pathname === '/cancel/confirm' ||
    pathname === '/pro' ||
    pathname === '/quiz' ||
    pathname === '/home' ||
    pathname === '/'

  const hideHeader =
    pathname === '/login' ||
    pathname === '/signin' ||
    pathname === '/not-found' ||
    pathname === '/pro' ||
    pathname === '/upgrade' ||
    pathname === '/cancel/success' ||
    pathname === '/cancel/failed' ||
    pathname === '/cancel/confirm' ||
    pathname === '/cancel' ||
    pathname === '/quiz' ||
    pathname === '/dashboard' ||
    pathname === '/'

  const showAltHeader =
    pathname === '/profile' ||
    pathname === '/'

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {!hideSidebar && (
        <div className="hidden lg:block h-full overflow-hidden shrink-0">
          <SidebarWrapper />
        </div>
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto main-scroll-container scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted hover:scrollbar-thumb-foreground">
          {!hideHeader && (
            <div className="sticky top-0 z-50">
              {showAltHeader ? <AltHeader /> : <Header />}
            </div>
          )}

          {children}

          <CookieBanner
            onAccept={() => console.log('Cookies accepted')}
            onReject={() => console.log('Cookies rejected')}
          />
        </div>
      </div>
    </div>
  )
}