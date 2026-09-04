'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { CheckIcon, ProIcon } from '@/public/icons/mono'
import BaseButton from '@/components/ui/baseButton'
import { GridContainer } from '@/components/ui/proUpgradeCard'
import PaddleUpgradeButton from '@/components/paddle-upgrade-button'
import { authClient } from '@/src/lib/auth/client'

const PricingPage = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  const handleSubscribe = () => {
    if (!session?.user) router.push('/login?returnTo=/pricing')
  }

  const handleCancel = () => router.push('/cancel')

  if (isPending) {
    return (
      <div className="h-dvh min-h-0 w-full overflow-hidden flex items-center justify-center bg-[#000437]">
        <p className="font-text font-semibold text-lg text-white">😅 Getting your pricing in a second...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col w-full h-screen max-h-screen overflow-hidden bg-[#000437] px-3 sm:px-0'>
      <div className='flex items-center justify-start w-full h-14 sm:h-18 px-3 sm:px-9 shrink-0'>
        <button type='button' onClick={() => router.push('/')} className='cursor-pointer hover:opacity-70 transition-opacity' aria-label='Go to home'>
          <span className='text-white text-2xl'>×</span>
        </button>
      </div>
      <div className='flex items-center justify-center w-full flex-1 min-h-0 py-4 sm:py-8'>
        <div className='flex flex-col w-full max-w-100 items-center justify-center h-full'>
          <h1 className='font-display text-white text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-11 px-3 sm:px-0 shrink-0'>Pricing</h1>
          <div className='flex flex-col items-center w-full px-3 sm:px-0 shrink-0'>
            <GridContainer first={<div />} second={<h2 className='font-text text-white text-[11px] sm:text-[16px] font-bold text-left uppercase'>Free</h2>} third={<ProIcon className='w-7 h-7 sm:w-auto sm:h-auto' />} isFirst />
            <GridContainer first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Quizes</h2>} second={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>2</h2>} third={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Unlimited</h2>} />
            <GridContainer first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Number of uploads</h2>} second={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>2</h2>} third={<CheckIcon color='#ffffff' size={12} />} />
            <GridContainer first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Answer Explanation</h2>} second={<CheckIcon color='#ffffff' size={12} />} third={<CheckIcon color='#ffffff' size={12} />} />
            <GridContainer first={<h2 className='font-text text-white text-[11px] sm:text-[15px] font-medium text-left'>Redo Quiz</h2>} second={<div />} third={<CheckIcon color='#ffffff' size={12} />} hideBorder isLast />
          </div>
          <div className='flex flex-col items-center gap-3 sm:gap-3.5 mt-6 sm:mt-11.75 w-full px-3 sm:px-0 shrink-0'>
            {session?.user ? (
              <PaddleUpgradeButton userId={session.user.id}>Upgrade to Pro $4.99/mo</PaddleUpgradeButton>
            ) : (
              <BaseButton variant='long' onClick={handleSubscribe} className='w-full max-w-100 h-10 sm:h-10.5 text-[11px] sm:text-[13px]'>Upgrade to Pro $4.99/mo</BaseButton>
            )}
            <button type='button' onClick={handleCancel} className='font-text text-white text-[11px] sm:text-[13px] font-medium hover:opacity-70 transition-opacity uppercase tracking-normal'>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingPage
