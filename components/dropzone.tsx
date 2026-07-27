import { Icon } from '@/lib/icons'
import { useRef, type RefObject } from 'react'

interface DropZoneProps {
  isDragging: boolean
  setIsDragging: (isDragging: boolean) => void
  isExpanded: boolean
  onExpandedChange: (isExpanded: boolean) => void
  addFiles: (files: FileList) => void
  storageNotice: string | null
  inputRef: RefObject<HTMLInputElement | null>
}

export function DropZone({
  isDragging,
  setIsDragging,
  isExpanded,
  onExpandedChange,
  addFiles,
  storageNotice,
  inputRef
}: DropZoneProps) {
  const openButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const openDropZone = () => {
    onExpandedChange(true)
    requestAnimationFrame(() => closeButtonRef.current?.focus())
  }

  const closeDropZone = () => {
    onExpandedChange(false)
    requestAnimationFrame(() => openButtonRef.current?.focus())
  }

  return (
    <section className='drop-zone-shell'>
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
        id='drop-zone-surface'
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${isExpanded ? 'is-expanded' : ''}`}
        onDragEnter={(event) => {
          event.preventDefault()
          setIsDragging(true)
        }}
        onDragOver={(event) => {
          event.preventDefault()
          event.dataTransfer.dropEffect = 'copy'
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false)
        }}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragging(false)
          if (event.dataTransfer.files.length > 0) addFiles(event.dataTransfer.files)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && isExpanded) closeDropZone()
        }}
        aria-label='File upload drop zone'>
        <div className='drop-zone-collapsed' aria-hidden={isExpanded} inert={isExpanded}>
          <div className='drop-icon-wrap'>
            <Icon name='upload' className='size-6' />
          </div>
          <div className='drop-zone-copy'>
            <span className='drop-zone-kicker'>Intelligent inbox</span>
            <h2>{isDragging ? 'Release to organize' : 'Drop files here to organize them'}</h2>
            <p>Content is classified privately on this device before it enters your library.</p>
          </div>

          <div className='drop-zone-actions'>
            <div className='flex items-center space-x-4'>
              <button
                ref={openButtonRef}
                id='open-drop-zone'
                className='flex items-center space-x-1'
                type='button'
                aria-controls='expanded-drop-zone'
                aria-expanded={isExpanded}
                onClick={openDropZone}>
                <Icon name='parachute' />
                <span>Open Drop Zone</span>
              </button>
            </div>
            <div className='flex items-center space-x-4'>
              <button className='add-button' type='button'>
                <Icon name='add' className='size-3.5' /> Special Drop
              </button>
            </div>

            <button type='button' className='bg-indigo-200' onClick={() => inputRef.current?.click()}>
              Browse files
            </button>
          </div>
        </div>

        <div className='expanded-drop-zone' id='expanded-drop-zone' aria-hidden={!isExpanded} inert={!isExpanded}>
          <button
            ref={closeButtonRef}
            className='expanded-drop-zone-close'
            type='button'
            onClick={closeDropZone}
            aria-label='Close drop zone'>
            <Icon name='close' size={18} />
          </button>

          <div className='expanded-drop-zone-content'>
            <div className='expanded-drop-zone-icon' aria-hidden='true'>
              <Icon name={isDragging ? 'parachute' : 'upload'} className='size-8' />
            </div>
            <span className='drop-zone-kicker'>{isDragging ? 'Ready when you are' : 'Drop zone is open'}</span>
            <h2>{isDragging ? 'Release to start organizing' : 'Drop your files anywhere here'}</h2>
            <p>
              Add documents, images, or mixed folders. Everything is analyzed privately and sorted into your library.
            </p>
            <div className='expanded-drop-zone-actions'>
              <button type='button' onClick={() => inputRef.current?.click()}>
                <Icon name='add' size={17} />
                Choose files
              </button>
              <span>
                <Icon name='shield-check' size={15} /> Private processing on this device
              </span>
            </div>
          </div>
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
