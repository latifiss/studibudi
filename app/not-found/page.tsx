import Link from 'next/link'
import BaseButton from '@/components/ui/baseButton'
import { SpillIcon } from '@/public/icons/illustrations'

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-[#1a1a2e] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center max-w-125">
        <div className="relative mb-8">
          <span className="font-display text-[#000000] dark:text-white text-8xl sm:text-9xl font-bold tracking-tight block relative z-10">
            404
          </span>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[160%] max-w-87.5 z-0">
            <SpillIcon
              size={350}
              color="#4F4CF0"
              className="w-full h-auto dark:opacity-80"
            />
          </div>
        </div>

        <div className="space-y-3 mt-10">
          <h2 className="font-display text-[#333333] dark:text-white text-2xl sm:text-3xl font-medium">
            Page Not Found
          </h2>
          <p className="font-text text-[#737373] dark:text-[#9CA3AF] text-base sm:text-lg max-w-100">
            The page you&apos;re looking for doesn&apos;t exist or has been moved to another URL.
          </p>
        </div>

        <div className="mt-8 w-full max-w-100">
          <Link href="/" className="w-full">
            <BaseButton variant="default" className="w-full px-8">
              Go Back Home
            </BaseButton>
          </Link>
        </div>
      </div>
    </div>
  )
}