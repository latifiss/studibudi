'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { DocsIcon } from '@/public/icons/illustrations'

interface UploadProps {
  variant?: 'default' | 'alternate'
  className?: string
}

const Upload = ({ variant = 'default', className }: UploadProps) => {
  const isAlternate = variant === 'alternate'

  return (
    <div
      className={cn(
        'flex flex-col items-start p-4 sm:p-6 lg:p-6',
        'bg-white rounded-3xl',
        'relative',
        isAlternate ? 'w-full max-w-[961px] h-[299px]' : 'w-full max-w-[322px] sm:max-w-[500px] lg:max-w-[400px] h-[165px] sm:h-[279px] lg:h-[612px]',
        'shadow-[0px_0px_1px_rgba(0,0,0,0.05),0px_3.2px_89.6px_-25.6px_rgba(0,0,0,0.1),0px_6.4px_102.4px_-38.4px_rgba(0,0,0,0.2),0px_12.8px_64px_-38.4px_rgba(0,0,0,0.3),0px_19.2px_76.8px_-51.2px_rgba(0,0,0,0.4),0px_25.6px_89.6px_-64px_rgba(0,0,0,0.5)]',
        'after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none after:bg-white/0.002',
        'z-0',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-col justify-center items-center',
          'w-full h-full',
          'z-10',
          isAlternate ? 'p-4 sm:p-6' : 'p-4 sm:p-6'
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23737373' stroke-width='1.5' stroke-dasharray='8 8' stroke-dashoffset='0' stroke-linecap='square' rx='12'/%3e%3c/svg%3e")`,
        }}
      >
        <div
          className={cn(
            'flex flex-col items-center justify-center',
            'w-full h-full',
            isAlternate ? 'max-w-[320px]' : 'max-w-[189.98px] sm:max-w-[320px] lg:max-w-[320px]'
          )}
        >
          <div className={cn(
            'flex items-center justify-center',
            isAlternate ? 'w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px]' : 'w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px]'
          )}>
            <DocsIcon 
              size={isAlternate ? 60 : 50} 
              className="w-full h-full"
            />
          </div>

          <div className={cn(
            'flex flex-col items-center',
            'w-full',
            isAlternate ? 'gap-1' : 'gap-0.5 sm:gap-1'
          )}>
            <h3
              className={cn(
                'text-center font-bold text-[#333333]',
                isAlternate ? 'text-[16px] sm:text-[18px] lg:text-[20px]' : 'text-[10px] sm:text-[16px] lg:text-[20px]',
                'leading-[20px] sm:leading-[24px] lg:leading-[28px]',
                'font-text'
              )}
            >
              Drop file here to start a quiz
            </h3>

            <p
              className={cn(
                'text-center text-[#737373]',
                isAlternate ? 'text-[12px] sm:text-[13px] lg:text-[14px]' : 'text-[8px] sm:text-[12px] lg:text-[14px]',
                'leading-[16px] sm:leading-[18px] lg:leading-[20px]',
                'font-text font-normal'
              )}
            >
              Supports PDF, DOC, DOCX, PPT, PPTX
            </p>
          </div>

          <div className={cn(
            'flex flex-col items-start',
            isAlternate ? 'pt-3 sm:pt-4' : 'pt-2 sm:pt-3 lg:pt-4',
            isAlternate ? 'w-[120px]' : 'w-[70px] sm:w-[120px] lg:w-[137px]'
          )}>
            <button
              className={cn(
                'flex items-center justify-center',
                'bg-[#4F4CF0] text-white rounded-lg',
                'font-text font-semibold',
                'shadow-[0px_8px_16px_-12px_rgba(0,0,0,0.8),0px_12px_16px_-12px_rgba(79,76,240,0.64),inset_0px_-2px_0px_rgba(0,0,0,0.1),inset_0px_2px_0px_rgba(255,255,255,0.25)]',
                'hover:opacity-90 transition-opacity',
                'w-full',
                isAlternate ? 'h-[40px] sm:h-[44px] lg:h-[48px] text-[14px] sm:text-[16px] lg:text-[18px]' : 'h-[24px] sm:h-[40px] lg:h-[48px] text-[9px] sm:text-[14px] lg:text-[18px]'
              )}
            >
              Choose file
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload