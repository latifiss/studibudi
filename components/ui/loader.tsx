'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { AIcon, BIcon, CIcon, DIcon } from '@/public/icons/load'

interface LoaderProps {
  size?: number
  gap?: number
  onComplete?: () => void
}

type Point = {
  x: number
  y: number
}

const Loader = ({ size = 71.5, gap = 20, onComplete }: LoaderProps) => {
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(true)

  const padding = 8
  const step = size + gap
  const gridSize = size * 2 + gap + padding * 2

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
  const isTablet = typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth < 1024
  
  const responsiveSize = isMobile ? size * 0.6 : isTablet ? size * 0.8 : size
  const responsiveGap = isMobile ? gap * 0.6 : isTablet ? gap * 0.8 : gap
  const responsiveGridSize = responsiveSize * 2 + responsiveGap + padding * 2

  const positions: Record<string, Point> = {
    topLeft: {
      x: padding,
      y: padding,
    },
    topRight: {
      x: responsiveSize + responsiveGap + padding,
      y: padding,
    },
    bottomLeft: {
      x: padding,
      y: responsiveSize + responsiveGap + padding,
    },
    bottomRight: {
      x: responsiveSize + responsiveGap + padding,
      y: responsiveSize + responsiveGap + padding,
    },
  }

  const durationPerMove = 0.32

  const transition = {
    duration: durationPerMove * 5,
    ease: [0.45, 0, 0.55, 1] as const,
    repeat: Infinity,
    repeatType: 'loop' as const,
    delay: 0.001,
  }

  useEffect(() => {
    if (progress >= 100) {
      setIsUploading(false)
      onComplete?.()
      return
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const increment = Math.random() * 8 + 2
        return Math.min(prev + increment, 100)
      })
    }, 100)

    return () => clearInterval(interval)
  }, [progress, onComplete])

  const ProgressBar = () => (
    <div className="flex flex-col items-center px-4 sm:px-6">
      <div className="relative w-full max-w-65.75 h-7 rounded-full overflow-hidden bg-[#D9D9D9]">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-100 ease-linear will-change-transform"
          style={{
            width: `${progress}%`,
            background: `repeating-linear-gradient(
              -45deg,
              #2FD792 0px,
              #2FD792 19.5px,
              #35BAF3 19.5px,
              #35BAF3 39px
            )`,
            backgroundSize: '55.15px 100%',
          }}
        />
      </div>
      <div className="flex flex-col items-center mt-4 sm:mt-6">
        <p className="font-text text-[#333333] text-[18px] sm:text-[20px] leading-6 sm:leading-7 font-bold text-center">
          Uploading your file
        </p>
        <p className="font-text text-[#333333] text-[18px] sm:text-[20px] leading-6 sm:leading-7 font-bold text-center">
          {Math.round(progress)}% done
        </p>
      </div>
    </div>
  )

  const QuizLoader = () => (
    <div className="flex flex-col items-center px-4 sm:px-6">
      <div
        className="relative"
        style={{
          width: responsiveGridSize,
          height: responsiveGridSize,
          overflow: 'visible',
        }}
      >
        <motion.div
          className="absolute left-0 top-0"
          animate={{
            x: [
              positions.topLeft.x,
              positions.bottomLeft.x,
              positions.topRight.x,
              positions.bottomRight.x,
              positions.topLeft.x,
            ],
            y: [
              positions.topLeft.y,
              positions.bottomLeft.y,
              positions.topRight.y,
              positions.bottomRight.y,
              positions.topLeft.y,
            ],
          }}
          transition={transition}
        >
          <AIcon size={responsiveSize} />
        </motion.div>

        <motion.div
          className="absolute left-0 top-0"
          animate={{
            x: [
              positions.topRight.x,
              positions.bottomRight.x,
              positions.bottomLeft.x,
              positions.topLeft.x,
              positions.topRight.x,
            ],
            y: [
              positions.topRight.y,
              positions.bottomRight.y,
              positions.bottomLeft.y,
              positions.topLeft.y,
              positions.topRight.y,
            ],
          }}
          transition={transition}
        >
          <BIcon size={responsiveSize} />
        </motion.div>

        <motion.div
          className="absolute left-0 top-0"
          animate={{
            x: [
              positions.bottomLeft.x,
              positions.topLeft.x,
              positions.bottomRight.x,
              positions.topRight.x,
              positions.bottomLeft.x,
            ],
            y: [
              positions.bottomLeft.y,
              positions.topLeft.y,
              positions.bottomRight.y,
              positions.topRight.y,
              positions.bottomLeft.y,
            ],
          }}
          transition={transition}
        >
          <CIcon size={responsiveSize} />
        </motion.div>

        <motion.div
          className="absolute left-0 top-0"
          animate={{
            x: [
              positions.bottomLeft.x,
              positions.topRight.x,
              positions.topLeft.x,
              positions.bottomLeft.x,
              positions.bottomRight.x,
              positions.topRight.x,
            ],
            y: [
              positions.bottomLeft.y,
              positions.topRight.y,
              positions.topLeft.y,
              positions.bottomLeft.y,
              positions.bottomRight.y,
              positions.topRight.y,
            ],
          }}
          transition={transition}
        >
          <DIcon size={responsiveSize} />
        </motion.div>
      </div>

      <div className="flex flex-col items-center mt-6 sm:mt-8.5">
        <p className="font-text text-[#333333] text-[18px] sm:text-[20px] leading-6 sm:leading-7 font-bold text-center">
          Hold on tight!
        </p>
        <p className="font-text text-[#333333] text-[18px] sm:text-[20px] leading-6 sm:leading-7 font-bold text-center">
          We&apos;re generating your quiz...
        </p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white">
      {isUploading ? <ProgressBar /> : <QuizLoader />}
    </div>
  )
}

export default Loader