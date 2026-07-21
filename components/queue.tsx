import { STATUS_COPY } from '@/constants'
import { Icon } from '@/lib/icons'
import { QueueItem } from '@/types'
import { formatBytes, getFileIcon } from '@/utils'
import Image from 'next/image'
import { CategoryPill } from './library'

interface QueueProps {
  queue: QueueItem[]
  activeQueueCount: number
  completedCount: number
  removeItem: (id: string) => void
  retryItem: (id: string) => void
  clearQueue: () => void
}

export const Queue = ({ queue, activeQueueCount, completedCount, removeItem, retryItem, clearQueue }: QueueProps) => {
  return (
    <section className='queue-section' aria-labelledby='queue-title'>
      <div className='section-heading'>
        <div>
          <span className='section-kicker'>Live processing</span>
          <h2 id='queue-title'>Upload queue</h2>
        </div>
        <div className='queue-heading-actions'>
          {queue.length > 0 ? (
            <span>{activeQueueCount > 0 ? `${activeQueueCount} processing` : `${completedCount} complete`}</span>
          ) : null}
          {completedCount > 0 ? (
            <button type='button' onClick={clearQueue}>
              Clear completed
            </button>
          ) : null}
        </div>
      </div>

      <div className='queue-list'>
        {queue.length === 0 ? (
          <div className='queue-empty'>
            <span>
              <Icon name='receipt' />
            </span>
            <div>
              <strong>Your queue is clear</strong>
              <p>Files begin processing as soon as you drop them.</p>
            </div>
          </div>
        ) : (
          queue.map((item) => (
            <article className='queue-item' key={item.id}>
              <div className='file-preview'>
                {item.previewUrl ? (
                  <Image src={item.previewUrl} alt='preview' width={24} height={24} />
                ) : (
                  <Icon name={getFileIcon(item.file.name, item.file.type, 24)} />
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
                  <Icon name='x' size={17} />
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  )
}
