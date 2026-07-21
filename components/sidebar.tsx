import { CATEGORY_META } from '@/constants'
import { Icon } from '@/lib/icons'
import type { CategoryName, StoredFile } from '@/types'
import { formatBytes } from '@/utils'

interface SidebarProps {
  activeQueueCount: number
  library: StoredFile[]
  activeCategory: CategoryName
  setActiveCategory: (category: CategoryName) => void
  categoryCounts: Map<CategoryName, number>
}

export const Sidebar = ({
  activeQueueCount,
  library,
  activeCategory,
  setActiveCategory,
  categoryCounts
}: SidebarProps) => {
  const storageUsed = library.reduce((total, file) => total + file.size, 0)
  const storagePercent = Math.min(100, (storageUsed / (256 * 1024 * 1024)) * 100)

  return (
    <aside className='sidebar'>
      <nav className='primary-nav' aria-label='File navigation'>
        <button
          className={`nav-item ${activeCategory === 'All' ? 'active' : ''}`}
          type='button'
          onClick={() => setActiveCategory('All')}>
          <Icon name='file-blank' />
          All files
          <span className='nav-count'>{library.length}</span>
        </button>
        <button className='nav-item' type='button'>
          <Icon name='clock' />
          Recent
        </button>
        <button className='nav-item' type='button'>
          <Icon name='favorite' />
          Favorites
        </button>
        <button className='nav-item' type='button'>
          <Icon name='upload' />
          Uploads
          {activeQueueCount > 0 ? <span className='nav-count queue-count'>{activeQueueCount}</span> : null}
        </button>
      </nav>

      <div className='sidebar-section'>
        <div className='sidebar-label'>
          <span>Smart folders</span>
          <Icon name='sparkles' />
        </div>
        <div className='folder-list'>
          {(Object.keys(CATEGORY_META) as CategoryName[]).map((category) => {
            const count = categoryCounts.get(category) ?? 0
            if (category === 'All' || count === 0) return null
            return (
              <button
                className={`folder-item ${activeCategory === category ? 'selected' : ''}`}
                type='button'
                key={category}
                onClick={() => setActiveCategory(category)}>
                <span className='folder-dot' style={{ background: CATEGORY_META[category].color }} />
                <span>{category}</span>
                <span>{count}</span>
              </button>
            )
          })}
          {categoryCounts.size === 0 ? <p className='folder-placeholder'>Folders appear as files are sorted.</p> : null}
        </div>
      </div>

      <div className='sidebar-footer'>
        <nav className='utility-nav' aria-label='Account navigation'>
          <button className='nav-item' type='button'>
            <Icon name='settings-fill' />
            Settings
          </button>
          <button className='nav-item' type='button'>
            <Icon name='trash-delete' />
            Deleted files
          </button>
        </nav>

        <div className='storage-card'>
          <div className='storage-card-heading'>
            <span>
              <Icon name='hard-drive' /> Local storage
            </span>
            <span>{Math.round(storagePercent)}%</span>
          </div>
          <div className='storage-track' aria-hidden='true'>
            <span style={{ width: `${Math.max(storagePercent, 2)}%` }} />
          </div>
          <p>{formatBytes(storageUsed)} used of 256 MB</p>
        </div>

        <div className='privacy-note'>
          <Icon name='shield-check' />
          <span>Stored locally and private by design</span>
        </div>
      </div>
    </aside>
  )
}
