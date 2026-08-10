'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AvatarB, AvatarC, AvatarD } from '@/public/icons/avatar'
import { LeafLeftIcon, LeafRightIcon } from '@/public/icons/illustrations'

interface LovedProps {
  className?: string
}

interface ReviewItem {
  id: string
  name: string
  review: string
}

const reviews: ReviewItem[] = [
  {
    id: '1',
    name: 'Riley W.',
    review: 'Questions are accurate and perfectly aligned with my course content.',
  },
  {
    id: '2',
    name: 'Jordan T.',
    review: 'The AI generates relevant, well-structured questions and explains answers clearly. I love it.',
  },
]

const Loved = ({ className }: LovedProps) => {
  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-17.75 lg:px-0',
        'max-w-none lg:max-w-150',
        'flex flex-col items-center',
        className
      )}
    >
      <h2
        className={cn(
          'text-center text-[#333333]',
          'text-[24px] leading-6.5',
          'font-display font-medium',
          'max-w-88 sm:max-w-88 lg:max-w-85.75'
        )}
      >
        People all over the world trust
        pdf.net to chat with their docs
      </h2>

      <div
        className={cn(
          'flex items-center justify-center',
          'mt-5.25',
          'max-w-110.75'
        )}
      >
        <LeafLeftIcon size={84} className="shrink-0" />
        <p
          className={cn(
            'text-center text-[#333333]',
            'text-[14px] leading-4',
            'font-text font-medium',
            'flex-1',
            '-px-4 sm:-px-6 lg:-px-8',
            'mb-6'
          )}
        >
          I wish I got this earlier. It supercharges my learning.
          And it&apos;s simple to use
        </p>
        <LeafRightIcon size={84} className="shrink-0" />
      </div>

      <div
        className={cn(
          'w-full sm:w-full lg:max-w-98.25',
          'h-22',
          'flex items-center justify-center',
          '-mt-8'
        )}
      >
        <div className="flex flex-col items-center">
          <AvatarB size={48} className="mb-1" />
          <span className="font-text text-[12px] leading-3.25 text-[#333333] font-medium">
            Priscilla A.
          </span>
          <span className="font-text text-[9px] leading-2.75 text-[#737373] font-regular">
            Review
          </span>
        </div>
      </div>

      <div
        className={cn(
          'w-full',
          'flex flex-col items-center sm:flex-row sm:gap-[21.42px]',
          'mt-8 sm:mt-10 lg:mt-12',
          'gap-4'
        )}
      >
        {reviews.map((review, index) => (
          <div
            key={review.id}
            className={cn(
              'w-[80%] sm:flex-1',
              'rounded-lg',
              'p-4 sm:p-5 lg:p-6',
              'flex flex-col',
              'relative',
              '-mt-5'
            )}
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 292 99"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              {index === 0 ? (
                <path
                  d="M284.014 6.25481C286.716 33.774 291.431 82.7997 289.846 98.0699M277.018 4.75441C253.308 3.19326 193.827 0.829935 145.518 0.868383C94.4142 0.909056 26.6242 3.43322 4.05042 4.7544M284.014 98.0699C273.236 94.4331 203.524 92.3791 145.518 91.2954C103.562 90.5115 64.0689 90.2354 48.4766 90.2354C11.3275 90.2354 1.7796 92.2419 6.68384 83.968C8.22631 81.3657 8.74806 73.2888 8.41663 62.7235C7.88252 45.6972 5.13265 22.2083 0.868164 4.7544"
                  stroke="black"
                  strokeWidth="1.73578"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M7.01752 6.25481C4.31527 33.774 -0.398841 82.7997 1.18536 98.0699M14.0138 4.75441C37.7238 3.19326 97.205 0.829935 145.514 0.868383C196.618 0.909056 264.408 3.43322 286.981 4.7544M7.01752 98.0699C17.7959 94.4331 87.5077 92.3791 145.514 91.2954C187.47 90.5115 226.963 90.2354 242.555 90.2354C279.704 90.2354 289.252 92.2419 284.348 83.968C282.805 81.3657 282.284 73.2888 282.615 62.7235C283.149 45.6972 285.899 22.2083 290.164 4.7544"
                  stroke="black"
                  strokeWidth="1.73578"
                  strokeLinecap="round"
                />
              )}
            </svg>

            <p className="font-text text-[12px] leading-3.5 font-medium text-[#333333] flex-1 relative z-10">
              {review.review}
            </p>

            <div className="h-3.5" />

            <div className="flex items-center gap-2 relative z-10">
              {index === 0 ? (
                <AvatarC size={24} />
              ) : (
                <AvatarD size={24} />
              )}
              <div className="flex flex-col">
                <span className="font-text text-[12px] leading-3.5 text-[#333333] font-bold">
                  {review.name}
                </span>
                <span className="font-text text-[11px] leading-3.25 text-[#737373] font-regular">
                  Review
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loved