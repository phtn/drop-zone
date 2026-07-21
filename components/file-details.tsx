import { Icon } from '@/lib/icons'
import type { StoredFile } from '@/types'
import { formatBytes, getFileIcon } from '@/utils'
import { CategoryPill } from './library'

interface FileDetailsProps {
  file: StoredFile | null
  onClose: () => void
  deleteFile: (id: string) => void
}

function formatFileDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(value))
}

export function FileDetails({ file, onClose, deleteFile }: FileDetailsProps) {
  return (
    <>
      {file ? (
        <button className='details-backdrop' type='button' onClick={onClose} aria-label='Close file details' />
      ) : null}
      <aside className={`details-panel ${file ? 'has-file' : 'is-empty'}`} aria-label='File details'>
        <div className='details-panel-header'>
          <span>File intelligence</span>
          {file ? (
            <button type='button' onClick={onClose} aria-label='Close file details'>
              <Icon name='close' />
            </button>
          ) : null}
        </div>

        {file ? (
          <div className='details-content'>
            <div className='details-file-heading'>
              <span className='details-file-icon'>
                <Icon name={getFileIcon(file.name, file.mimeType)} size={25} />
              </span>
              <div>
                <h2>{file.name}</h2>
                <p>
                  {formatBytes(file.size)} <span>•</span> {formatFileDate(file.createdAt)}
                </p>
              </div>
            </div>

            <div className='details-actions'>
              <a href={`/api/files/${encodeURIComponent(file.id)}`}>
                <Icon name='external-link' /> Open file
              </a>
              <button
                type='button'
                onClick={() => {
                  deleteFile(file.id)
                  onClose()
                }}>
                <Icon name='trash-delete' />
              </button>
            </div>

            <section className='details-section'>
              <div className='details-section-heading'>
                <h3>Smart classification</h3>
                <Icon name='sparkles' size={15} />
              </div>
              <div className='details-tags'>
                <CategoryPill category={file.category} />
                <span>{file.kind}</span>
              </div>
              <div className='confidence-row'>
                <span>Match confidence</span>
                <strong>{file.confidence}%</strong>
              </div>
              <div className='confidence-track' aria-hidden='true'>
                <span style={{ width: `${file.confidence}%` }} />
              </div>
            </section>

            <section className='details-section'>
              <div className='details-section-heading'>
                <h3>Content summary</h3>
                <Icon name='shield-check' />
              </div>
              <p className='details-excerpt'>
                {file.excerpt || 'No readable text was found. This file was organized using its name and file type.'}
              </p>
              <span className='local-analysis-note'>Analyzed privately on this device</span>
            </section>

            <section className='details-section activity-section'>
              <h3>Activity</h3>
              <div className='activity-item'>
                <span className='activity-dot complete'>
                  <Icon name='check' />
                </span>
                <div>
                  <strong>Added to your library</strong>
                  <p>{formatFileDate(file.createdAt)}</p>
                </div>
              </div>
              <div className='activity-item'>
                <span className='activity-dot'>
                  <Icon name='sparkles' />
                </span>
                <div>
                  <strong>Sorted into {file.category}</strong>
                  <p>{file.confidence}% classification confidence</p>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <div className='details-placeholder'>
            <span>
              <Icon name='search' />
            </span>
            <h2>Select a file</h2>
            <p>Choose a file to see its classification, content summary, and local activity.</p>
          </div>
        )}
      </aside>
    </>
  )
}
