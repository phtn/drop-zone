import { Icon } from '@/lib/icons'
import type { RefObject } from 'react'

interface DropZoneProps {
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  addFiles: (files: FileList) => void
  storageNotice: string | null
  inputRef: RefObject<HTMLInputElement | null>
}

export function DropZone({ isDragging, setIsDragging, addFiles, storageNotice, inputRef }: DropZoneProps) {
  return (
    <section>
      <input
        ref={inputRef}
        className='visually-hidden'
        type='file'
        multiple
        onChange={(event) => {
          if (event.target.files) addFiles(event.target.files)
          event.target.value = ''
        }}
      />

      <section
        className={`drop-zone ${isDragging ? 'dragging' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(event) => {
          if (event.currentTarget === event.target) setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          addFiles(event.dataTransfer.files)
        }}
        aria-label='File upload drop zone'>
        <div className='drop-icon-wrap'>
          <Icon name='upload' className='size-6' />
        </div>
        <div className='drop-zone-copy'>
          <span className='drop-zone-kicker'>Intelligent inbox</span>
          <h2>{isDragging ? 'Release to organize' : 'Drop files here to organize them'}</h2>
          <p>Content is classified privately on this device before it enters your library.</p>
        </div>
        <div className='drop-zone-actions'>
          <span>
            <Icon name='sparkles' /> Auto-sort enabled
          </span>
          <button type='button' onClick={() => inputRef.current?.click()}>
            Browse files
          </button>
        </div>
      </section>

      {storageNotice ? (
        <div className='notice' role='status'>
          <Icon name='shield-check' />
          {storageNotice}
        </div>
      ) : null}
    </section>
  )
}
