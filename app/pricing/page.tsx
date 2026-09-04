'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ProUpgradeCard from '@/components/ui/proUpgradeCard'
import PaddleUpgradeButton from '@/components/paddle-upgrade-button'
import { authClient } from '@/src/lib/auth/client'

const PricingPage = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSubscribe = () => {
    if (!session?.user) {
      router.push('/login?returnTo=/pricing')
    }
  }

  const handleCancel = () => {
    router.push('/cancel')
  }

  if (isPending) {
    return (
      <div className="h-dvh min-h-0 w-full overflow-hidden flex items-center justify-center bg-[#000437]">
        <p className="font-text font-semibold text-lg text-white">
          😅 Getting your pricing in a second...
        </p>
      </div>
    )
  }

  return (
    <div className="h-dvh min-h-0 w-full overflow-hidden">
      <ProUpgradeCard
        onSubscribe={handleSubscribe}
        onCancel={handleCancel}
        subscribeButton={
          session?.user ? (
            <PaddleUpgradeButton userId={session.user.id}>
              Upgrade to Pro $4.99/mo
            </PaddleUpgradeButton>
          ) : undefined
        }
      />
    </div>
  )
}

export default PricingPage
