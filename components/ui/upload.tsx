'use client'

import React, { useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { DocsIcon } from '@/public/icons/illustrations'
import Loader from '@/components/ui/loader'

interface UploadProps {
  variant?: 'default' | 'alternate'
  className?: string
  onFileUpload?: (file: File) => void
  onQuizGenerated?: (quiz: any) => void
}

const Upload = ({ variant = 'default', className, onFileUpload, onQuizGenerated }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const isAlternate = variant === 'alternate'

  // In upload.tsx
// components/ui/upload.tsx - updated handleFileSelect
const handleFileSelect = async (file: File) => {
  setIsLoading(true)
  setError(null)
  onFileUpload?.(file)

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('numQuestions', '5')

    // Use absolute URL for API call
    const apiUrl = '/api/generate-quiz'
    
    console.log('Sending request to:', apiUrl)
    console.log('File:', file.name, file.size, file.type)

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })

    console.log('Response status:', response.status)

    // Try to get the response as text first for debugging
    const responseText = await response.text()
    console.log('Response text:', responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      throw new Error(`Server returned invalid response: ${responseText.substring(0, 100)}`)
    }

    if (!response.ok) {
      if (response.status === 504) {
        throw new Error('The request timed out. Please try again with a shorter document.')
      }
      if (response.status === 413) {
        throw new Error('File is too large. Please upload a smaller file.')
      }
      if (response.status === 500) {
        throw new Error('Server error. Please try again later.')
      }
      throw new Error(data.error || `Failed to generate quiz (Status: ${response.status})`)
    }
    
    if (data.success && data.quiz) {
      const savedQuizResponse = await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `Quiz ${new Date().toLocaleDateString()}`,
          sourceName: file.name,
          questions: data.quiz,
        }),
      })

      const savedQuizData = savedQuizResponse.ok ? await savedQuizResponse.json() : null

      const currentQuiz = Array.isArray(data.quiz) ? data.quiz : []
      localStorage.setItem('currentQuiz', JSON.stringify(currentQuiz))
      localStorage.setItem('currentQuizId', savedQuizData?.quiz?.id ?? '')
      onQuizGenerated?.(currentQuiz)

      // Navigate to quiz page
      const url = savedQuizData?.quiz?.id ? `/quiz?historyId=${savedQuizData.quiz.id}` : '/quiz'
      window.location.href = url
    } else {
      throw new Error(data.error || 'Failed to generate quiz')
    }
  } catch (error) {
    console.error('Upload error:', error)
    const message = error instanceof Error ? error.message : 'Failed to process file'
    setError(message)
    setIsLoading(false)
  } finally {
    setIsLoading(false)
  }
}

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
          <Loader onComplete={() => {}} />
        </div>
      )}

      <div
        className={cn(
          'flex flex-col items-start p-4 sm:p-6 lg:p-6',
          'bg-white rounded-3xl',
          'relative',
          isAlternate ? 'w-full max-w-[961px] h-[349px]' : 'w-full max-w-[322px] sm:max-w-[500px] lg:max-w-[400px] h-[165px] sm:h-[279px] lg:h-[612px]',
          'shadow-[0px_0px_1px_rgba(0,0,0,0.05),0px_3.2px_89.6px_-25.6px_rgba(0,0,0,0.1),0px_6.4px_102.4px_-38.4px_rgba(0,0,0,0.2),0px_12.8px_64px_-38.4px_rgba(0,0,0,0.3),0px_19.2px_76.8px_-51.2px_rgba(0,0,0,0.4),0px_25.6px_89.6px_-64px_rgba(0,0,0,0.5)]',
          'after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none after:bg-white/0.002',
          'z-0',
          isDragging && 'ring-2 ring-[#4F4CF0] ring-offset-2',
          className
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

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

            {error && (
              <p className="text-[#FE1212] text-sm mt-2 text-center">
                {error}
              </p>
            )}

            <div className={cn(
              'flex flex-col items-start',
              isAlternate ? 'pt-2 sm:pt-3' : 'pt-1 sm:pt-2 lg:pt-3',
              isAlternate ? 'w-[120px]' : 'w-[70px] sm:w-[120px] lg:w-[137px]'
            )}>
              <button
                onClick={handleButtonClick}
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
    </>
  )
}

export default Upload