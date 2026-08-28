'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import ProUpgradeCard from '@/components/ui/proUpgradeCard'
import PaddleUpgradeButton from '@/components/paddle-upgrade-button'
import { authClient } from '@/src/lib/auth/client'

const UpgradePage = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleCancel = () => {
    router.push('/cancel')
  }

  if (isPending) {
    return (
      <div className='flex items-center justify-center w-full h-screen bg-[#000437]'>
        <p className='font-text text-white text-sm'>Loading...</p>
      </div>
    )
  }

  if (!session?.user) {
    return (
      <div className='flex flex-col items-center justify-center w-full h-screen bg-[#000437] px-6 text-center'>
        <h1 className='font-display text-white text-2xl font-bold mb-3'>Sign in to upgrade</h1>
        <p className='font-text text-white/70 text-sm mb-6'>You need to be signed in before subscribing to Studibudi Pro.</p>
        <button
          type='button'
          onClick={() => router.push('/login')}
          className='font-text text-white text-sm underline hover:opacity-70 transition-opacity'
        >
          Sign in
        </button>
      </div>
    )
  }

  return (
    <ProUpgradeCard
      onSubscribe={() => undefined}
      onCancel={handleCancel}
      subscribeButton={
        <PaddleUpgradeButton userId={session.user.id}>
          Upgrade to Pro $4.99/mo
        </PaddleUpgradeButton>
      }
    />
  )
}

export default UpgradePage
