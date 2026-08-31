import posthog from 'posthog-js'

let initialized = false
let initializing: Promise<void> | null = null

export async function initPostHog() {
  if (initialized || typeof window === 'undefined') return
  if (initializing) return initializing

  initializing = fetch('/api/posthog-config', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) return

      const { key, host } = await response.json()
      if (!key) return

      posthog.init(key, {
        api_host: host || 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
        autocapture: true,
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: '[data-ph-mask]',
        },
        persistence: 'localStorage+cookie',
      })

      initialized = true
    })
    .catch(() => undefined)
    .finally(() => {
      initializing = null
    })

  return initializing
}

export function identifyPostHog(userId: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  posthog.identify(userId, properties)
}

export function resetPostHog() {
  if (!initialized) return
  posthog.reset()
}

export function capturePostHog(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return
  posthog.capture(event, properties)
}

export default posthog
