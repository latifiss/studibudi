import posthog from 'posthog-js'

const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const apiHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

let initialized = false

export function initPostHog() {
  if (initialized || !apiKey || typeof window === 'undefined') return

  posthog.init(apiKey, {
    api_host: apiHost,
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
