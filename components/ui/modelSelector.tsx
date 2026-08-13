'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  onSelect?: (model: string) => void
  className?: string
}

const ModelSelector = ({ onSelect, className }: ModelSelectorProps) => {
  const [models, setModels] = useState<any[]>([])
  const [selectedModel, setSelectedModel] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('/api/models')
        const data = await response.json()
        if (data.success) {
          setModels(data.models)
          if (data.models.length > 0) {
            setSelectedModel(data.models[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [])

  const handleSelect = (modelId: string) => {
    setSelectedModel(modelId)
    onSelect?.(modelId)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4F4CF0] border-t-transparent" />
        <span className="text-sm text-[#737373]">Loading models...</span>
      </div>
    )
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <label className="text-sm font-medium text-[#333333] dark:text-white">
        AI Model:
      </label>
      <select
        value={selectedModel}
        onChange={(e) => handleSelect(e.target.value)}
        className="px-3 py-1.5 text-sm rounded-lg border border-[#E5E5E5] bg-white dark:bg-[#1a1a2e] dark:border-[#3a3a4e] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#4F4CF0]"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ModelSelector