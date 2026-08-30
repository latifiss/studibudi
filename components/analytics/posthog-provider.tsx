"use client"

import { useEffect } from "react"
import { initPostHog, identifyPostHog, resetPostHog } from "@/lib/posthog"
import { useUser } from "@/hooks/use-user"

export default function PostHogProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!user) {
      resetPostHog()
      return
    }

    if (user.id) {
      identifyPostHog(user.id, {
        name: user.name || undefined,
      })
    }
  }, [user])

  return <>{children}</>
}
