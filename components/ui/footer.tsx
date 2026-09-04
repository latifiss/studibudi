'use client'

import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { GlobeIcon, AccessibilityIcon } from '@/public/icons/mono'
import { Wordmark } from '@/public/icons/logo'

interface FooterProps {
  className?: string
}

const Footer = ({ className }: FooterProps) => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn(
      'w-full bg-white border-t border-[#E5E5E5]',
      'px-4 sm:px-5 lg:px-40',
      'py-12 sm:py-12 lg:py-10',
      className
    )}>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8">
        <Wordmark size={148} className="text-black shrink-0" />

        <div className="hidden sm:flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[['Terms and conditions', '/terms'], ['Privacy Policy', '/privacy'], ['Pricing', '/pricing']].map(([item, href]) => (
              <Link
                key={item}
                href={href}
                className="font-text text-[14px] leading-5 font-medium text-[#333333] hover:opacity-70 transition-opacity"
              >
                {item}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {[['Contact Us', 'mailto:issakalatif49@gmail.com'], ['Cookie Policy', '/cookie'], ['Refund Policy', '/refund']].map(([item, href]) => (
              <Link
                key={item}
                href={href}
                className="font-text text-[14px] leading-5 font-medium text-[#333333] hover:opacity-70 transition-opacity"
              >
                {item}
              </Link>
            ))}
          </div>
          <p className="font-text text-[14px] leading-5 font-medium text-[#737373]">
            © {currentYear}, studibudi.com. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white h-10">
            <GlobeIcon size={18} className="text-black" />
            <span className="font-text text-[14px] font-medium text-black">EN</span>
          </div>

          <Link
            href="#"
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#E5E5E5] bg-white h-10 hover:bg-gray-50 transition-colors sm:flex hidden"
          >
            <AccessibilityIcon size={18} className="text-black" />
            <span className="font-text text-[14px] font-medium text-black">Accessibility</span>
          </Link>

          <Link
            href="#"
            className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E5E5E5] bg-white hover:bg-gray-50 transition-colors sm:hidden"
          >
            <AccessibilityIcon size={18} className="text-black" />
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 mt-6 sm:hidden">
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[['Terms and conditions', '/terms'], ['Privacy Policy', '/privacy'], ['Pricing', '/pricing']].map(([item, href]) => (
            <Link
              key={item}
              href={href}
              className="font-text text-[14px] leading-5 font-medium text-[#333333] hover:opacity-70 transition-opacity"
            >
              {item}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {[['Contact Us', 'mailto:issakalatif49@gmail.com'], ['Cookie Policy', '/cookie'], ['Refund Policy', '/refund']].map(([item, href]) => (
            <Link
              key={item}
              href={href}
              className="font-text text-[14px] leading-5 font-medium text-[#333333] hover:opacity-70 transition-opacity"
            >
              {item}
            </Link>
          ))}
        </div>
        <p className="font-text text-[14px] leading-5 font-medium text-[#737373]">
          © {currentYear}, studibudi.com. All rights reserved.
        </p>
      </div>

      <div className="flex justify-center mt-9.5">
        <p className="font-text text-[12px] leading-4 text-[#737373] text-center max-w-[80%] sm:max-w-full">
          * All trademarks, logos, and brand names are the property of their respective owners. All company, product, and service names used on this website are for identification purposes only. Use of these names, trademarks, and brands does not imply any affiliation or endorsement. If you represent a company listed here and have concerns, please contact us.
        </p>
      </div>
    </footer>
  )
}

export default Footer
