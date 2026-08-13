'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ProUpgradeCard from '@/components/ui/proUpgradeCard'

const UpgradePage = () => {
  const router = useRouter()

  const handleSubscribe = () => {
    // Initialize Paddle checkout
    // @ts-ignore - Paddle global
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        product: 'your-product-id',
        email: 'user@email.com',
        successCallback: (data: any) => {
          console.log('Subscription successful:', data)
          router.push('/dashboard')
        },
        closeCallback: () => {
          console.log('Checkout closed')
        }
      })
    }
  }

  const handleCancel = () => {
    router.push('/cancel')
  }

  return (
    <ProUpgradeCard 
      onSubscribe={handleSubscribe}
      onCancel={handleCancel}
    />
  )
}

export default UpgradePage