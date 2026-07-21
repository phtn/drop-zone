import { CATEGORY_META } from '@/constants'
import { Icon } from '@/lib/icons'
import type { CategoryName, StoredFile } from '@/types'
import { formatBytes, getFileIcon } from '@/utils'
import { useState } from 'react'

interface LibraryProps {
  filteredLibrary: StoredFile[]
  categoryCounts: Map<CategoryName, number>
  activeCategory: CategoryName
  setActiveCategory: (category: CategoryName) => void
  search: string
  deleteFile: (id: string) => void
  selectedFileId: string | null
  selectFile: (id: string) => void
  onAddFiles: () => void
}

function formatFileDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(new Date(value))
}

export function CategoryPill({ category }: { category: CategoryName }) {
  const meta = CATEGORY_META[category]
  return (
    <span className='category-pill' style={{ color: meta.color, background: meta.background }}>
      {category}
    </span>
  )
}

function EmptyLibrary({ filtered }: { filtered: boolean }) {
  return (
    <div className='empty-library'>
      <span className='empty-library-icon'>
        <Icon name={filtered ? 'search' : 'folder'} />
      </span>
      <div>
        <strong>{filtered ? 'No files match this view' : 'Your organized files will appear here'}</strong>
        <p>
          {filtered ? 'Try another search or smart folder.' : 'Add a file and Dropwell will classify it automatically.'}
        </p>
      </div>
    </div>
  )
}

export const Library = ({
  filteredLibrary,
  categoryCounts,
  activeCategory,
  setActiveCategory,
  search,
  deleteFile,
  selectedFileId,
  selectFile,
  onAddFiles
}: LibraryProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const quickCategories = (Object.keys(CATEGORY_META) as CategoryName[])
    .filter((category) => category !== 'All' && (categoryCounts.get(category) ?? 0) > 0)
    .sort((a, b) => (categoryCounts.get(b) ?? 0) - (categoryCounts.get(a) ?? 0))
    .slice(0, 4)

  return (
    <>
      {quickCategories.length > 0 ? (
        <section className='quick-access-panel' aria-labelledby='quick-access-title'>
          <div className='panel-heading'>
            <div>
              <h2 id='quick-access-title'>Quick access</h2>
              <p>Your busiest smart folders</p>
            </div>
            <button className='text-button' type='button' onClick={() => setActiveCategory('All')}>
              View all
            </button>
          </div>
          <div className='quick-access-grid'>
            {quickCategories.map((category) => {
              const meta = CATEGORY_META[category]
              const count = categoryCounts.get(category) ?? 0
              return (
                <button
                  className={`quick-access-card ${activeCategory === category ? 'selected' : ''}`}
                  type='button'
                  key={category}
                  onClick={() => setActiveCategory(category)}>
                  <span className='quick-folder-icon' style={{ color: meta.color, background: meta.background }}>
                    <Icon name='folder' className='size-6' />
                  </span>
                  <span>
                    <strong>{category}</strong>
                    <small>
                      {count} {count === 1 ? 'file' : 'files'}
                    </small>
                  </span>
                  <Icon name='chevron-right' size={16} />
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      <section className='library-section files-panel' id='library' aria-labelledby='library-title'>
        <div className='files-toolbar'>
          <div className='files-breadcrumb'>
            <span>Files</span>
            <Icon name='chevrons-right' size={15} />
            <strong id='library-title'>{activeCategory === 'All' ? 'All files' : activeCategory}</strong>
          </div>
          <div className='files-toolbar-actions'>
            <div className='view-switcher' aria-label='File view'>
              <button
                className={viewMode === 'list' ? 'active' : ''}
                type='button'
                aria-label='List view'
                aria-pressed={viewMode === 'list'}
                onClick={() => setViewMode('list')}>
                <Icon name='list' />
              </button>
              <button
                className={viewMode === 'grid' ? 'active' : ''}
                type='button'
                aria-label='Grid view'
                aria-pressed={viewMode === 'grid'}
                onClick={() => setViewMode('grid')}>
                <Icon name='grid' />
              </button>
            </div>
            <button className='panel-add-button' type='button' onClick={onAddFiles}>
              <Icon name='add' /> Add new
            </button>
          </div>
        </div>

        {filteredLibrary.length === 0 ? (
          <EmptyLibrary filtered={Boolean(search || activeCategory !== 'All')} />
        ) : viewMode === 'list' ? (
          <div className='file-table' role='table' aria-label='File library'>
            <div className='file-table-head' role='row'>
              <span role='columnheader'>Name</span>
              <span role='columnheader'>Smart folder</span>
              <span role='columnheader'>Size</span>
              <span role='columnheader'>Added</span>
              <span aria-hidden='true' />
            </div>
            <div className='file-table-body'>
              {filteredLibrary.map((file) => (
                <div className={`file-row ${selectedFileId === file.id ? 'selected' : ''}`} role='row' key={file.id}>
                  <div className='file-name-cell' role='cell'>
                    <span className='file-type-icon'>
                      <Icon name={getFileIcon(file.name, file.mimeType)} className='size-7' />
                    </span>
                    <button type='button' onClick={() => selectFile(file.id)} title={file.name}>
                      <p className='text-sm'>{file.name}</p>
                      <small>{file.kind}</small>
                    </button>
                  </div>
                  <div role='cell'>
                    <CategoryPill category={file.category} />
                  </div>
                  <span className='file-cell-muted' role='cell'>
                    {formatBytes(file.size)}
                  </span>
                  <span className='file-cell-muted' role='cell'>
                    {formatFileDate(file.createdAt)}
                  </span>
                  <div className='file-row-actions' role='cell'>
                    <a href={`/api/files/${encodeURIComponent(file.id)}`} aria-label={`Open ${file.name}`}>
                      <Icon name='external-link' size={15} />
                    </a>
                    <button type='button' onClick={() => deleteFile(file.id)} aria-label={`Delete ${file.name}`}>
                      <Icon name='trash-delete' />
                    </button>
                    <button type='button' aria-label={`More options for ${file.name}`}>
                      <Icon name='more-h' />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className='library-grid'>
            {filteredLibrary.map((file) => (
              <article className={`library-card ${selectedFileId === file.id ? 'selected' : ''}`} key={file.id}>
                <div className='library-card-top'>
                  <span className='file-type-icon large'>
                    <Icon name={getFileIcon(file.name, file.mimeType)} size={22} />
                  </span>
                  <button className='icon-button' type='button' aria-label={`More options for ${file.name}`}>
                    <Icon name='more-h' />
                  </button>
                </div>
                <button className='library-card-body' type='button' onClick={() => selectFile(file.id)}>
                  <h3 title={file.name}>{file.name}</h3>
                  <p>{file.kind}</p>
                </button>
                <div className='library-card-footer'>
                  <CategoryPill category={file.category} />
                  <span>{formatBytes(file.size)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
