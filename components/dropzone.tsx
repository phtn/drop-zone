import { Icon } from '@/lib/icons'
import { RefObject } from 'react'

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
        <div className='drop-zone-grid' />
        <div className='drop-icon-wrap'>
          <Icon name='parachute' className='size-16' />
          <span className='drop-spark one' />
          <span className='drop-spark two' />
        </div>
        <h2>{isDragging ? 'Release to add files' : 'Drop your files anywhere here'}</h2>
        <p>Any file — up to 20 MB each.</p>
        <button type='button' onClick={() => inputRef.current?.click()}>
          Choose files
          <Icon name='chevrons-right' size={15} />
        </button>
        <div className='drop-privacy'>
          <Icon name='globe' size={13} />
          Content is read locally before upload
        </div>
      </section>

      {storageNotice ? (
        <div className='notice' role='status'>
          <Icon name='alert-fill' size={17} />
          {storageNotice}
        </div>
      ) : null}
    </section>
  )
}
