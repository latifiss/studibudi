'use client'

import React from 'react'
import Link from 'next/link'
import { CloseIcon, CorrectIcon, WrongIcon } from '@/public/icons/mono'
import BaseButton from '@/components/ui/baseButton'

interface CancelResultPageProps {
  status?: 'success' | 'failed'
  onRetry?: () => void
}

const CancelResultPage = ({
  status = 'success',
  onRetry,
}: CancelResultPageProps) => {
  const isSuccess = status === 'success'

  return (
    <div className="flex flex-col w-full h-dvh min-h-0 max-h-dvh overflow-hidden bg-[#000437] px-3 sm:px-0">
      <div className="flex items-center justify-start w-full h-14 sm:h-18 px-3 sm:px-9 shrink-0">
        <Link
          href="/"
          className="cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Go to home"
        >
          <CloseIcon color="#ffffff" />
        </Link>
      </div>

      <main className="flex items-center justify-center w-full flex-1 min-h-0 overflow-hidden py-4 sm:py-8">
        <div className="flex flex-col w-full max-w-100 items-center justify-center min-h-0">
          <div className="mb-6 shrink-0">
            {isSuccess ? (
              <CorrectIcon color="#22C55E" size={96} />
            ) : (
              <WrongIcon color="#FE1212" size={96} />
            )}
          </div>

          <h1 className="font-display text-white text-2xl sm:text-3xl font-bold text-center mb-3 shrink-0">
            {isSuccess ? 'Subscription Cancelled' : 'Cancellation Failed'}
          </h1>

          <p className="font-text text-white/80 text-center mb-8 max-w-[320px] shrink-0">
            {isSuccess
              ? "Your PRO subscription has been cancelled. You'll continue to have access until the end of your billing period."
              : "We couldn't process your cancellation request. Please try again or contact support."}
          </p>

          {isSuccess ? (
            <Link
              href="/dashboard"
              className="w-full flex justify-center shrink-0"
            >
              <BaseButton
                variant="default"
                className="w-full max-w-50"
              >
                Return to Dashboard
              </BaseButton>
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-100 shrink-0">
              <BaseButton
                variant="default"
                onClick={onRetry}
                className="w-full sm:w-auto min-w-35"
              >
                Try Again
              </BaseButton>

              <Link
                href="/dashboard"
                className="w-full sm:w-auto"
              >
                <BaseButton
                  variant="outline"
                  className="w-full sm:w-auto min-w-35"
                >
                  Go to Dashboard
                </BaseButton>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CancelResultPage

