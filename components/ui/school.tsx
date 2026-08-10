'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { AshvilleCollege, Adelaide, Bushnell, Cascadilla } from '@/public/icons/schools'

interface SchoolProps {
  className?: string
}

const School = ({ className }: SchoolProps) => {
  const schools = [
    { id: 1, icon: <AshvilleCollege size={54} /> },
    { id: 2, icon: <Adelaide size={54} /> },
    { id: 3, icon: <Bushnell size={54} /> },
    { id: 4, icon: <Cascadilla size={54} /> },
  ]

  return (
    <div
      className={cn(
        'w-full mx-auto',
        'px-4 sm:px-5 lg:px-0',
        'flex flex-col items-center',
        className
      )}
    >
      <h2
        className={cn(
          'text-center text-[#333333]',
          'text-[20px] leading-10',
          'font-display font-medium',
          'mb-4 sm:mb-6 lg:mb-6'
        )}
      >
        Used by students at
      </h2>

      <div
        className={cn(
          'flex flex-wrap items-center justify-center',
          'gap-x-5.25 sm:gap-x-5.25 lg:gap-x-10',
          'gap-y-5.25 sm:gap-y-5.25 lg:gap-y-10',
          'w-full',
          'max-w-77.25 sm:max-w-200 lg:max-w-281.75'
        )}
      >
        {schools.map((school) => (
          <div
            key={school.id}
            className="flex items-center justify-center [&>svg]:h-8.5 [&>svg]:w-auto sm:[&>svg]:h-8.5 lg:[&>svg]:h-13.5"
          >
            {school.icon}
          </div>
        ))}
      </div>
    </div>
  )
}

export default School