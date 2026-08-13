'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ConfirmLeave from '@/components/ui/confirmLeave'

const ConfirmCancelPage = () => {
  const router = useRouter()

  const handleKeepUsing = () => {
    router.push('/dashboard')
  }

  const handleProceedToCancel = () => {
    // Call Paddle cancellation API
    // For demo, simulate success
    router.push('/cancel/success')
  }

  return (
    <ConfirmLeave 
      onKeepUsing={handleKeepUsing}
      onProceedToCancel={handleProceedToCancel}
    />
  )
}

export default ConfirmCancelPage