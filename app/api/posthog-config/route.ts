import { NextResponse } from 'next/server'

export async function GET() {
  const key = process.env.POSTHOG_KEY
  const host = process.env.POSTHOG_HOST || 'https://us.i.posthog.com'

  if (!key) {
    return NextResponse.json(
      { error: 'PostHog is not configured' },
      { status: 503 }
    )
  }

  return NextResponse.json({ key, host })
}
