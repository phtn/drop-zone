'use client'

import { DropZone } from '@/components/dropzone'
import { Hero } from '@/components/hero'
import { Library } from '@/components/library'
import { MobileHeader } from '@/components/mobile-header'
import { Queue } from '@/components/queue'
import { Sidebar } from '@/components/sidebar'
import { CategoryName, QueueItem, StoredFile } from '@/types'
import { analyzeFile } from '@/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type FileDashboardProps = {
  initialLibrary?: StoredFile[]
  initialStorageNotice?: string
}

export function FileDashboard({ initialLibrary = [], initialStorageNotice = '' }: FileDashboardProps) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [library, setLibrary] = useState<StoredFile[]>(initialLibrary)
  const [isDragging, setIsDragging] = useState(false)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<CategoryName | 'All'>('All')
  const [storageNotice, setStorageNotice] = useState(initialStorageNotice)
  const inputRef = useRef<HTMLInputElement>(null)
  const queueRef = useRef<QueueItem[]>([])
  const processingRef = useRef(false)

  const syncQueue = useCallback((update: (items: QueueItem[]) => QueueItem[]) => {
    const next = update(queueRef.current)
    queueRef.current = next
    setQueue(next)
  }, [])

  const updateQueueItem = useCallback(
    (id: string, changes: Partial<QueueItem>) => {
      syncQueue((items) => items.map((item) => (item.id === id ? { ...item, ...changes } : item)))
    },
    [syncQueue]
  )

  useEffect(() => {
    return () => {
      for (const item of queueRef.current) {
        if (item.previewUrl) URL.revokeObjectURL(item.previewUrl)
      }
    }
  }, [])

  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true

    while (true) {
      const item = queueRef.current.find((candidate) => candidate.status === 'queued')
      if (!item) break

      try {
        updateQueueItem(item.id, { status: 'reading', progress: 4, error: undefined })
        const classification = await analyzeFile(item.file, (progress) => {
          updateQueueItem(item.id, {
            status: 'reading',
            progress: Math.min(82, progress)
          })
        })

        updateQueueItem(item.id, {
          status: 'classifying',
          progress: 88,
          classification
        })

        await new Promise((resolve) => window.setTimeout(resolve, 280))
        updateQueueItem(item.id, { status: 'uploading', progress: 93 })

        const formData = new FormData()
        formData.append('file', item.file)
        formData.append('category', classification.category)
        formData.append('kind', classification.kind)
        formData.append('confidence', String(classification.confidence))
        formData.append('excerpt', classification.excerpt)

        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData
        })

        if (!response.ok) {
          const payload = (await response.json().catch(() => ({}))) as {
            error?: string
          }
          throw new Error(payload.error ?? 'Upload could not be completed')
        }

        const payload = (await response.json()) as { file: StoredFile }
        setLibrary((current) => [payload.file, ...current])
        setStorageNotice('')
        updateQueueItem(item.id, { status: 'done', progress: 100 })
      } catch (error) {
        updateQueueItem(item.id, {
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'Something went wrong'
        })
      }
    }

    processingRef.current = false
  }, [updateQueueItem])

  const addFiles = useCallback(
    (fileList: FileList | globalThis.File[]) => {
      const files = Array.from(fileList).filter((file) => file.size > 0)
      if (files.length === 0) return

      const nextItems: QueueItem[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: 'queued',
        progress: 0,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
      }))

      syncQueue((current) => [...current, ...nextItems])
      window.setTimeout(() => void processQueue(), 0)
    },
    [processQueue, syncQueue]
  )

  const retryItem = useCallback(
    (id: string) => {
      updateQueueItem(id, { status: 'queued', error: undefined, progress: 0 })
      window.setTimeout(() => void processQueue(), 0)
    },
    [processQueue, updateQueueItem]
  )

  const removeQueueItem = useCallback(
    (id: string) => {
      const item = queueRef.current.find((candidate) => candidate.id === id)
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl)
      syncQueue((items) => items.filter((candidate) => candidate.id !== id))
    },
    [syncQueue]
  )

  const clearCompleted = useCallback(() => {
    for (const item of queueRef.current) {
      if (item.status === 'done' && item.previewUrl) {
        URL.revokeObjectURL(item.previewUrl)
      }
    }
    syncQueue((items) => items.filter((item) => item.status !== 'done'))
  }, [syncQueue])

  const deleteStoredFile = useCallback(
    async (id: string) => {
      const previous = library
      setLibrary((current) => current.filter((file) => file.id !== id))
      const response = await fetch(`/api/files/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        setLibrary(previous)
        setStorageNotice('That file could not be removed. Please try again.')
      }
    },
    [library]
  )

  const filteredLibrary = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return library.filter((file) => {
      const categoryMatches = activeCategory === 'All' || file.category === activeCategory
      const searchMatches =
        !needle || `${file.name} ${file.kind} ${file.category} ${file.excerpt}`.toLowerCase().includes(needle)
      return categoryMatches && searchMatches
    })
  }, [activeCategory, library, search])

  const categoryCounts = useMemo(() => {
    const counts = new Map<CategoryName, number>()
    for (const file of library) {
      counts.set(file.category, (counts.get(file.category) ?? 0) + 1)
    }
    return counts
  }, [library])

  const activeQueueCount = queue.filter((item) => item.status !== 'done' && item.status !== 'error').length
  const completedCount = queue.filter((item) => item.status === 'done').length

  return (
    <div className='app-shell'>
      <Sidebar
        activeQueueCount={activeQueueCount}
        library={library}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categoryCounts={categoryCounts}
      />
      <main className='main-content'>
        <MobileHeader search={search} setSearch={setSearch} inputRef={inputRef} />
        <div className='workspace'>
          <Hero />
          <DropZone
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            addFiles={addFiles}
            storageNotice={storageNotice}
            inputRef={inputRef}
          />

          <Queue
            queue={queue}
            activeQueueCount={activeQueueCount}
            completedCount={completedCount}
            removeItem={removeQueueItem}
            retryItem={retryItem}
            clearQueue={clearCompleted}
          />

          <Library
            filteredLibrary={filteredLibrary}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            search={search}
          />
        </div>
      </main>
    </div>
  )
}
