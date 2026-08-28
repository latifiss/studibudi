'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { HeroIcon } from '@/public/icons/illustrations'
import { AvatarA } from '@/public/icons/avatar'
import Upload from './upload'

interface HeroProps {
  className?: string
}

const Hero = ({ className }: HeroProps) => {
  return (
    <section
      className={cn(
        'flex flex-wrap items-start content-start',
        'px-4 sm:px-6 lg:px-2',
        'pt-4 sm:pt-6 lg:pt-16',
        'gap-x-0 lg:gap-x-55',
        'gap-y-8 sm:gap-y-10 lg:gap-y-0',
        'w-full max-w-90 sm:max-w-150.75 lg:max-w-280',
        'mx-auto',
        className
      )}
    >
      <div className="flex flex-col items-start gap-6 sm:gap-8 lg:gap-8 flex-1 w-full lg:w-125">
        <h1
          className={cn(
            'font-display text-[#333333]',
            'text-[27px] sm:text-[46px] lg:text-[56px]',
            'leading-8.25 sm:leading-14 lg:leading-14',
            'tracking-[-0.33px] sm:tracking-[-0.56px] lg:tracking-[-0.56px]',
            'font-medium text-center sm:text-left',
            'max-w-90 sm:max-w-150.75 lg:max-w-141.5'
          )}
        >
          Turn Your Notes into Instant Quizzes – Upload & Start Now!
        </h1>

        <p
          className={cn(
            'font-text text-[#333333]',
            'text-[14px] sm:text-[18px] lg:text-[24px]',
            'leading-4.5 sm:leading-6 lg:leading-7.5',
            'tracking-[-0.14px] sm:tracking-[-0.18px] lg:tracking-[-0.24px]',
            'font-normal text-center sm:text-left',
            'max-w-90 sm:max-w-150.75 lg:max-w-116.25'
          )}
        >
          Turn lectures, slides, or textbooks into personalized quizzes in seconds. No more manual flashcards. Get questions, answers, and explanations instantly and anytime, anywhere, no downloads needed.
        </p>

        <div className="w-full max-w-90 sm:max-w-113 lg:max-w-113 relative hidden lg:block">
          <div
            className={cn(
              'w-full',
              'rounded-lg',
              'p-4 sm:p-5 lg:p-6',
              'flex flex-col',
              'relative'
            )}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 292 99"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M284.014 6.25481C286.716 33.774 291.431 82.7997 289.846 98.0699M277.018 4.75441C253.308 3.19326 193.827 0.829935 145.518 0.868383C94.4142 0.909056 26.6242 3.43322 4.05042 4.7544M284.014 98.0699C273.236 94.4331 203.524 92.3791 145.518 91.2954C103.562 90.5115 64.0689 90.2354 48.4766 90.2354C11.3275 90.2354 1.7796 92.2419 6.68384 83.968C8.22631 81.3657 8.74806 73.2888 8.41663 62.7235C7.88252 45.6972 5.13265 22.2083 0.868164 4.7544"
                stroke="black"
                strokeWidth="1.73578"
                strokeLinecap="round"
              />
            </svg>

            <p className="font-text text-[18px] leading-6 font-medium text-[#333333] flex-1 relative z-10">
              "The AI is very good, concise and accurate. refers exactly to the points in document for further reading."
            </p>

            <div className="h-3.5" />

            <div className="flex items-center gap-2 relative z-10">
              <AvatarA size={24} />
              <div className="flex flex-col">
                <span className="font-text text-[18px] leading-6 text-[#333333] font-bold">
                  Allen J.
                </span>
                <span className="font-text text-[14px] leading-5 text-[#737373] font-regular">
                  Review
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center w-full lg:w-100 relative">
        <div className="absolute pointer-events-none z-0 inset-0 overflow-visible">
          <div className="hidden lg:block absolute" style={{ top: '-50px', left: '-203px' }}>
            <HeroIcon className="w-166.5 h-auto" />
          </div>
          <div className="hidden sm:block lg:hidden absolute" style={{ top: '-70px', left: '50%', transform: 'translateX(-50%)' }}>
            <HeroIcon className="w-53.25 h-auto" />
          </div>
          <div className="block sm:hidden absolute" style={{ top: '-36px', left: '50%', transform: 'translateX(-50%)' }}>
            <HeroIcon className="w-31.5 h-auto" />
          </div>
        </div>
        <div className="relative z-10 w-full max-w-80.5 sm:max-w-125 lg:max-w-100">
          <Upload 
  variant="default" 
  onFileUpload={(file) => {
    console.log('File selected:', file.name)
    // Handle file upload logic here
  }}
/>
        </div>
      </div>

      <div className="w-full max-w-90 sm:max-w-113 lg:max-w-113 relative lg:hidden">
        <div
          className={cn(
            'w-full',
            'rounded-lg',
            'p-4 sm:p-5 lg:p-6',
            'flex flex-col',
            'relative'
          )}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 292 99"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M284.014 6.25481C286.716 33.774 291.431 82.7997 289.846 98.0699M277.018 4.75441C253.308 3.19326 193.827 0.829935 145.518 0.868383C94.4142 0.909056 26.6242 3.43322 4.05042 4.7544M284.014 98.0699C273.236 94.4331 203.524 92.3791 145.518 91.2954C103.562 90.5115 64.0689 90.2354 48.4766 90.2354C11.3275 90.2354 1.7796 92.2419 6.68384 83.968C8.22631 81.3657 8.74806 73.2888 8.41663 62.7235C7.88252 45.6972 5.13265 22.2083 0.868164 4.7544"
              stroke="black"
              strokeWidth="1.73578"
              strokeLinecap="round"
            />
          </svg>

          <p className="font-text text-[14px] sm:text-[18px] leading-5 sm:leading-6 font-medium text-[#333333] flex-1 relative z-10">
            "The AI is very good, concise and accurate. refers exactly to the points in document for further reading."
          </p>

          <div className="h-3.5" />

          <div className="flex items-center gap-2 relative z-10">
            <AvatarA size={24} />
            <div className="flex flex-col">
              <span className="font-text text-[18px] leading-6 text-[#333333] font-bold">
                Allen J.
              </span>
              <span className="font-text text-[14px] leading-5 text-[#737373] font-regular">
                Review
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero