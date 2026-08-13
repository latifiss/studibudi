'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import CancelResultPage from '@/components/ui/cancelResultPage'

const CancelFailedPage = () => {
  const router = useRouter()

  const handleRetry = () => {
    router.push('/cancel')
  }

  return <CancelResultPage status="failed" onRetry={handleRetry} />
}

export default CancelFailedPage