'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import LeaveFeedback from '@/components/ui/leaveFeedback'

const CancelPage = () => {
  const router = useRouter()

  const handleContinue = (selectedId: string) => {
    console.log('Cancellation reason:', selectedId)
    router.push('/cancel/confirm')
  }

  return (
    <main className="h-full min-h-0 w-full overflow-hidden flex items-center justify-center">
      <LeaveFeedback onContinue={handleContinue} />
    </main>
  )
}

export default CancelPage
