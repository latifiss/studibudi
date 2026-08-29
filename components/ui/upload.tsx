'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { DocsIcon } from '@/public/icons/illustrations'
import Loader from '@/components/ui/loader'

interface UploadProps {
  variant?: 'default' | 'alternate'
  className?: string
  onFileUpload?: (file: File) => void
  onQuizGenerated?: (quiz: any) => void
}

const MAX_FILE_SIZE = 50 * 1024 * 1024
const ACCEPTED_FILE_TYPES = '.pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.xls,.xlsx'
const UPGRADE_PATH = '/upgrade'
const FREE_LIMIT_ERRORS = new Set(['FREE_QUIZ_LIMIT_REACHED', 'FREE_UPLOAD_LIMIT_REACHED'])

const Upload = ({ variant = 'default', className, onFileUpload, onQuizGenerated }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isAlternate = variant === 'alternate'

  useEffect(() => {
    const openUpload = () => fileInputRef.current?.click()
    window.addEventListener('studibudi:open-upload', openUpload)
    return () => window.removeEventListener('studibudi:open-upload', openUpload)
  }, [])

  const redirectIfLimitReached = (data: any) => {
    if (FREE_LIMIT_ERRORS.has(String(data?.error || '')) || FREE_LIMIT_ERRORS.has(String(data?.code || ''))) {
      window.location.assign(UPGRADE_PATH)
      return true
    }
    return false
  }

  const handleFileSelect = async (file: File) => {
    if (file.size > MAX_FILE_SIZE) { setError('File is too large. The maximum file size is 50MB.'); return }
    if (file.size === 0) { setError('The selected file is empty.'); return }

    setIsLoading(true)
    setError(null)
    onFileUpload?.(file)
    let key: string | null = null

    try {
      const presignResponse = await fetch('/api/uploads/presign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName: file.name, fileSize: file.size, contentType: file.type || 'application/octet-stream' }),
      })
      const presignData = await presignResponse.json()
      if (!presignResponse.ok) { if (redirectIfLimitReached(presignData)) return; throw new Error(presignData.message || presignData.error || 'Failed to prepare the file upload.') }
      if (!presignData.uploadUrl || !presignData.key) throw new Error(presignData.message || presignData.error || 'Failed to prepare the file upload.')
      key = presignData.key

      const uploadResponse = await fetch(presignData.uploadUrl, { method: 'PUT', headers: { 'Content-Type': file.type || 'application/octet-stream' }, body: file })
      if (!uploadResponse.ok) throw new Error('Failed to upload the file to secure storage.')

      const quizResponse = await fetch('/api/generate-quiz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, fileName: file.name, numQuestions: 5 }) })
      const data = await quizResponse.json()
      if (!quizResponse.ok) { if (redirectIfLimitReached(data)) return; throw new Error(data?.message || data?.error || 'Failed to generate quiz.') }
      if (!data?.success || !Array.isArray(data.quiz) || !data.quiz.length) throw new Error('The AI did not generate a valid quiz from this file.')

      const savedQuizResponse = await fetch('/api/quizzes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: data.title, sourceName: file.name, questions: data.quiz }) })
      if (!savedQuizResponse.ok) { const savedError = await savedQuizResponse.json().catch(() => null); if (redirectIfLimitReached(savedError)) return; throw new Error(savedError?.message || savedError?.error || 'Quiz was generated but could not be saved.') }

      const savedQuizData = await savedQuizResponse.json()
      localStorage.setItem('currentQuiz', JSON.stringify(data.quiz))
      localStorage.setItem('currentQuizId', savedQuizData?.quiz?.id ?? '')
      onQuizGenerated?.(data.quiz)
      window.location.href = savedQuizData?.quiz?.id ? `/quiz?historyId=${savedQuizData.quiz.id}` : '/quiz'
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Failed to process file.')
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) handleFileSelect(file); if (fileInputRef.current) fileInputRef.current.value = '' }
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => { event.preventDefault(); setIsDragging(false); const file = event.dataTransfer.files?.[0]; if (file) handleFileSelect(file) }

  return (
    <>
      {isLoading && <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white"><Loader onComplete={() => {}} /></div>}
      <div
        className={cn(
          'flex flex-col items-start p-4 sm:p-6 lg:p-6 bg-white rounded-3xl relative',
          isAlternate ? 'w-full max-w-[961px] h-[349px] sm:h-[261.75px] lg:h-[261.75px]' : 'w-full max-w-[322px] sm:max-w-[500px] lg:max-w-[400px] h-[231px] sm:h-[279px] lg:h-[612px]',
          'shadow-[0px_0px_1px_rgba(0,0,0,0.05),0px_3.2px_89.6px_-25.6px_rgba(0,0,0,0.1),0px_6.4px_102.4px_-38.4px_rgba(0,0,0,0.2),0px_12.8px_64px_-38.4px_rgba(0,0,0,0.3),0px_19.2px_76.8px_-51.2px_rgba(0,0,0,0.4),0px_25.6px_89.6px_-64px_rgba(0,0,0,0.5)]',
          'after:absolute after:inset-0 after:rounded-3xl after:pointer-events-none after:bg-white/0.002 z-0',
          isDragging && 'ring-2 ring-[#4F4CF0] ring-offset-2', className
        )}
        onDrop={handleDrop}
        onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }}
        onDragLeave={(event) => { event.preventDefault(); setIsDragging(false) }}
      >
        <input ref={fileInputRef} type="file" accept={ACCEPTED_FILE_TYPES} className="hidden" onChange={handleFileChange} />
        <div className="flex flex-col justify-center items-center w-full h-full z-10 p-4 sm:p-6" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23737373' stroke-width='1.5' stroke-dasharray='8 8' stroke-dashoffset='0' stroke-linecap='square' rx='12'/%3e%3c/svg%3e")` }}>
          <div className={cn('flex flex-col items-center justify-center w-full h-full', isAlternate ? 'max-w-[320px]' : 'max-w-[189.98px] sm:max-w-[320px] lg:max-w-[320px]')}>
            <div className={cn('flex items-center justify-center', isAlternate ? 'w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px]' : 'w-[60px] h-[60px] sm:w-[100px] sm:h-[100px] lg:w-[140px] lg:h-[140px]')}><DocsIcon size={isAlternate ? 60 : 50} className="w-full h-full" /></div>
            <div className={cn('flex flex-col items-center w-full', isAlternate ? 'gap-1' : 'gap-0.5 sm:gap-1')}>
              <h3 className={cn('text-center font-bold text-[#333333] font-text', isAlternate ? 'text-[16px] sm:text-[18px] lg:text-[20px]' : 'text-[14px] sm:text-[16px] lg:text-[20px]', 'leading-[20px] sm:leading-[24px] lg:leading-[28px]')}>Drop file here to start a quiz</h3>
              <p className={cn('text-center text-[#737373] font-text font-normal', isAlternate ? 'text-[12px] sm:text-[13px] lg:text-[14px]' : 'text-[12px] sm:text-[12px] lg:text-[14px]', 'leading-[16px] sm:leading-[18px] lg:leading-[20px]')}>Supports PDF, DOC, DOCX, PPT, PPTX, TXT, CSV, XLS, XLSX up to 50MB</p>
            </div>
            {error && <p className="text-[#FE1212] text-sm mt-2 text-center">{error}</p>}
            <div className={cn('flex flex-col items-start', isAlternate ? 'pt-2 sm:pt-3 w-[120px]' : 'pt-1 sm:pt-2 lg:pt-3 w-[70px] sm:w-[120px] lg:w-[137px]')}>
              <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isLoading} className={cn('flex items-center justify-center bg-[#4F4CF0] text-white rounded-lg font-text font-semibold shadow-[0px_8px_16px_-12px_rgba(0,0,0,0.8),0px_12px_16px_-12px_rgba(79,76,240,0.64),inset_0px_-2px_0px_rgba(0,0,0,0.1),inset_0px_2px_0px_rgba(255,255,255,0.25)] hover:opacity-90 transition-opacity disabled:opacity-50 w-full', isAlternate ? 'h-[40px] sm:h-[44px] lg:h-[48px] text-[14px] sm:text-[16px] lg:text-[18px]' : 'h-[24px] sm:h-[40px] lg:h-[48px] text-[9px] sm:text-[14px] lg:text-[18px]')}>Choose file</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Upload
