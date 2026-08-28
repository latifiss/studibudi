'use client'

import React from 'react'
import { HeroIcon } from '@/public/icons/illustrations'
import Upload from '@/components/ui/upload'
import DashboardHeader from '@/components/layout/dashboardHeader'

const Dashboard = () => {
  return (
    <div className="h-dvh min-h-0 w-full flex flex-col bg-white overflow-hidden">
      <DashboardHeader />

      <main className="flex-1 min-h-0 w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col items-center justify-center w-full max-w-175 min-h-0">
          <HeroIcon
            size={180}
            className="w-45 h-auto sm:w-30 lg:w-20 mb-4 sm:mb-5 shrink-0"
          />

          <h1 className="font-display text-[#333333] text-center shrink-0">
            <span className="text-[24px] sm:text-[30px] lg:text-[36px] leading-7.5 sm:leading-9.5 lg:leading-11 font-medium block">
              Upload a File and get
            </span>

            <span className="text-[24px] sm:text-[30px] lg:text-[36px] leading-6 sm:leading-7 lg:leading-8 font-medium block">
              Instant Quiz!
            </span>
          </h1>

          <div className="mt-6 sm:mt-8 lg:mt-10 w-full max-w-150 shrink-0">
            <Upload
              variant="alternate"
              className="h-[244px] sm:h-[349px] lg:h-[349px]"
              onFileUpload={(file) => {
                console.log('File selected:', file.name)
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
