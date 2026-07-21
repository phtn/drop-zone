import { CATEGORY_META } from '@/constants'
import { Icon } from '@/lib/icons'
import { CategoryName, StoredFile } from '@/types'
import { formatBytes, getFileIcon } from '@/utils'
import { MoreHorizontal, Search, Trash2 } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

interface LibraryProps {
  filteredLibrary: StoredFile[]
  activeCategory: CategoryName
  setActiveCategory: Dispatch<SetStateAction<CategoryName>>
  search: string
  deleteFile: (id: string) => void
}

export function CategoryPill({ category }: { category: CategoryName }) {
  const meta = CATEGORY_META[category]
  return (
    <span className='category-pill' style={{ color: meta.color, background: meta.background }}>
      {category}
    </span>
  )
}

function EmptyLibrary() {
  return (
    <div className='empty-library'>
      <span className='empty-library-icon'>
        <Icon name='folder-open' />
      </span>
      <div>
        <strong>Your organized files will appear here</strong>
        <p>Drop something above to create your first smart folder.</p>
      </div>
    </div>
  )
}

export const Library = ({ filteredLibrary, activeCategory, setActiveCategory, search, deleteFile }: LibraryProps) => {
  return (
    <section className='library-section' id='library' aria-labelledby='library-title'>
      <div className='section-heading'>
        <div>
          <span className='section-kicker'>Organized automatically</span>
          <h2 id='library-title'>{activeCategory === 'All' ? 'Your library' : activeCategory}</h2>
        </div>
        {activeCategory !== 'All' ? (
          <button className='view-all-button' type='button' onClick={() => setActiveCategory('All')}>
            View all files
          </button>
        ) : null}
      </div>

      {filteredLibrary.length === 0 ? (
        search || activeCategory !== 'All' ? (
          <div className='empty-library'>
            <span className='empty-library-icon'>
              <Search size={22} />
            </span>
            <div>
              <strong>No files match this view</strong>
              <p>Try another search or choose a different smart folder.</p>
            </div>
          </div>
        ) : (
          <EmptyLibrary />
        )
      ) : (
        <div className='library-grid'>
          {filteredLibrary.map((file) => (
            <article className='library-card' key={file.id}>
              <div className='library-card-top'>
                <div className='flex space-x-2'>
                  <Icon name={getFileIcon(file.name, file.mimeType)} />
                  <CategoryPill category={file.category} />
                </div>
                <button className='icon-button' type='button' aria-label={`More options for ${file.name}`}>
                  <MoreHorizontal size={18} />
                </button>
              </div>
              <div className='library-card-body'>
                <h3 title={file.name}>{file.name}</h3>
                {/*<p>{file.excerpt || `${file.kind}, sorted by file type and filename.`}</p>*/}
              </div>
              <div className='library-card-footer'>
                <div>
                  <span className='uppercase'>{file.mimeType.split('/').pop()}</span>
                  <span>•</span>
                  <span>{formatBytes(file.size)}</span>
                </div>
                <div className='library-actions'>
                  <a href={`/api/files/${encodeURIComponent(file.id)}`} aria-label={`Download ${file.name}`}>
                    Open
                  </a>
                  <button type='button' onClick={() => deleteFile(file.id)} aria-label={`Delete ${file.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
