import { STATUS_COPY } from '@/constants'
import { Icon } from '@/lib/icons'
import { QueueItem } from '@/types'
import { formatBytes, getFileIcon } from '@/utils'
import Image from 'next/image'
import { CategoryPill } from './library'

interface QueueProps {
  queue: QueueItem[]
  activeQueueCount: number
  removeItem: (id: string) => void
  retryItem: (id: string) => void
  isOpen: boolean
  onClose: () => void
}

export const Queue = ({
  queue,
  activeQueueCount,
  removeItem,
  retryItem,
  isOpen,
  onClose
}: QueueProps) => {
  if (queue.length === 0) return null

  const errorCount = queue.filter((item) => item.status === 'error').length
  const activeItem = queue.find((item) => item.status !== 'queued' && item.status !== 'error' && item.status !== 'done')
  const primaryItem = activeItem ?? queue.find((item) => item.status === 'error') ?? queue[0]
  const secondaryItem = queue.find((item) => item.id !== primaryItem.id)
  const visibleItems = secondaryItem ? [primaryItem, secondaryItem] : [primaryItem]
  const statusCopy =
    activeQueueCount > 0
      ? `${queue.length} file${queue.length === 1 ? '' : 's'} in queue`
      : errorCount > 0
        ? `${errorCount} need${errorCount === 1 ? 's' : ''} attention`
        : 'Finishing upload'

  return (
    <section
      className={`queue-section queue-sheet ${isOpen ? 'open' : ''}`}
      aria-labelledby='queue-title'
      aria-hidden={!isOpen}
      aria-live='polite'
      inert={!isOpen}>
      <div className='queue-sheet-handle' aria-hidden='true' />
      <div className='section-heading'>
        <div>
          <span className='section-kicker'>{errorCount > 0 ? 'Needs attention' : 'Live processing'}</span>
          <h2 id='queue-title'>Upload queue</h2>
        </div>
        <div className='queue-heading-actions'>
          <span>{statusCopy}</span>
          <button className='queue-sheet-close' type='button' onClick={onClose} aria-label='Hide upload queue'>
            <Icon name='chevron-down' size={18} />
          </button>
        </div>
      </div>

      <div className={`queue-stack ${visibleItems.length > 1 ? 'has-preview' : ''}`}>
        {visibleItems.map((item, index) => {
          const isPreview = index === 1
          return (
            <article
              className={`queue-item ${isPreview ? 'queue-item-preview' : ''}`}
              key={item.id}
              aria-hidden={isPreview}
              inert={isPreview}>
              <div className='file-preview'>
                {item.previewUrl ? (
                  <Image src={item.previewUrl} alt='preview' width={24} height={24} />
                ) : (
                  <Icon name={getFileIcon(item.file.name, item.file.type)} />
                )}
              </div>
              <div className='queue-file-info'>
                <div className='queue-file-title'>
                  <strong title={item.file.name}>{item.file.name}</strong>
                  {item.classification ? <CategoryPill category={item.classification.category} /> : null}
                </div>
                <div className='queue-file-meta'>
                  <span>{formatBytes(item.file.size)}</span>
                  <span>•</span>
                  <span>{STATUS_COPY[item.status]}</span>
                  {item.classification ? (
                    <>
                      <span>•</span>
                      <span>{item.classification.confidence}% match</span>
                    </>
                  ) : null}
                </div>
                {item.error ? <p className='item-error'>{item.error}</p> : null}
                <div className='progress-track' aria-hidden='true'>
                  <span
                    className={item.status === 'error' ? 'error' : ''}
                    style={{ width: `${item.status === 'error' ? 100 : item.progress}%` }}
                  />
                </div>
              </div>
              <div className='queue-status-icon' aria-label={STATUS_COPY[item.status]}>
                {item.status === 'done' ? <Icon name='check' size={18} /> : null}
                {item.status === 'error' ? <Icon name='alert-fill' size={18} /> : null}
                {item.status !== 'done' && item.status !== 'error' ? <Icon name='spinner-ring' /> : null}
              </div>
              {item.status === 'error' ? (
                <button
                  className='icon-button'
                  type='button'
                  onClick={() => retryItem(item.id)}
                  aria-label={`Retry ${item.file.name}`}>
                  <Icon name='refresh' size={16} />
                </button>
              ) : null}
              {item.status === 'queued' || item.status === 'done' || item.status === 'error' ? (
                <button
                  className='icon-button'
                  type='button'
                  onClick={() => removeItem(item.id)}
                  aria-label={`Remove ${item.file.name} from queue`}>
                  <Icon name='close' size={17} />
                </button>
              ) : null}
            </article>
          )
        })}
      </div>
    </section>
  )
}
