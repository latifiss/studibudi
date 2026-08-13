'use client'

import React from 'react'
import { HeroIcon } from '@/public/icons/illustrations'
import Upload from '@/components/ui/upload'
import DashboardHeader from '@/components/layout/dashboardHeader'

const Dashboard = () => {
  return (
    <div className="h-screen w-full flex flex-col bg-white overflow-hidden">
      {/* Dashboard Header - visible on tablet and mobile only */}
      <DashboardHeader />
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex flex-col items-center w-full max-w-175">
          <HeroIcon size={180} className="w-45 h-auto sm:w-30 lg:w-20 mb-4 sm:mb-5" />

          <h1 className="font-display text-[#333333] text-center">
            <span className="text-[24px] sm:text-[30px] lg:text-[36px] leading-7.5 sm:leading-9.5 lg:leading-11 font-medium block">
              Upload a File and get
            </span>
            <span className="text-[24px] sm:text-[30px] lg:text-[36px] leading-6 sm:leading-7 lg:leading-8 font-medium block">
              Instant Quiz!
            </span>
          </h1>

          <div className="mt-6 sm:mt-8 lg:mt-10 w-full max-w-150">
            <Upload 
              variant="alternate" 
              className="h-50 sm:h-70 lg:h-74.75"
              onFileUpload={(file) => {
                console.log('File selected:', file.name)
                // Handle file upload logic here
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard