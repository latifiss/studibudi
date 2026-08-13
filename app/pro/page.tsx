'use client'

import Footer from '@/components/ui/footer'
import ConfirmLeave from '@/components/ui/confirmLeave'
import LeaveFeedback from '@/components/ui/leaveFeedback'
import ProUpgradeCard from '@/components/ui/proUpgradeCard'
import QuizSelection from '@/components/ui/quizSelection'
import React from 'react'
import FAQ from '@/components/ui/faq'
import Loved from '@/components/ui/loved'
import How from '@/components/ui/how'
import { HeroIcon, UploadIcon } from '@/public/icons/illustrations'
import Compare from '@/components/ui/compare'
import Detail from '@/components/ui/detail'
import School from '@/components/ui/school'
import Upload from '@/components/ui/upload'
import Hero from '@/components/ui/hero'

const page = () => {
  return (
    <div>
      {/* <Footer/> */}
      {/* <FAQ/> */}
      {/* <Loved/> */}
      {/* <How />
      <Compare/> */}
      {/* <Detail/> */}
      {/* <School />
      <Upload/> */}
      {/* <Hero/> */}
          <ProUpgradeCard />
          <LeaveFeedback/>
          <ConfirmLeave/>
          {/* <QuizSelection 
  label="What is the capital of France?"
  optionLetter="A"
/>

<QuizSelection 
  label="Paris"
  optionLetter="A"
  selected={true}
/>

<QuizSelection 
  label="London"
  optionLetter="B"
  onClick={() => console.log('Option B selected')}
/> */}
    </div>
  )
}

export default page