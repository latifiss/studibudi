import { CloseIcon } from '@/public/icons/mono'
import React from 'react'
import Link from 'next/link'

const AltHeader = () => {
  return (
    <div className='flex items-center justify-start w-full h-18 px-9'>
      <Link 
        href="/"
        className="cursor-pointer hover:opacity-70 transition-opacity"
        aria-label="Go to home"
      >
        <CloseIcon className="text-foreground" />
      </Link>
    </div>
  )
}

export default AltHeader