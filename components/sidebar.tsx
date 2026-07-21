import { CATEGORY_META } from '@/constants'
import { Icon } from '@/lib/icons'
import { CategoryName, StoredFile } from '@/types'
import { Folder, HardDrive, ShieldCheck, Sparkles } from 'lucide-react'

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
  return (
    <div>
      <aside className='sidebar'>
        <div className='brand'>
          <Icon name='re-up.ph' className='' />
          <span>dropwell</span>
        </div>

        <nav className='primary-nav' aria-label='Primary navigation'>
          <button className='nav-item active' type='button'>
            <HardDrive size={18} />
            Inbox
            {activeQueueCount > 0 ? <span className='nav-count'>{activeQueueCount}</span> : null}
          </button>
          <button
            className='nav-item'
            type='button'
            onClick={() => {
              setActiveCategory('All')
              document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
            }}>
            <Folder size={18} />
            All files
            <span className='nav-count subtle'>{library.length}</span>
          </button>
        </nav>

        <div className='sidebar-section'>
          <div className='sidebar-label'>
            <span>Smart folders</span>
            <Sparkles size={13} />
          </div>
          <div className='folder-list'>
            {(Object.keys(CATEGORY_META) as CategoryName[]).map((category) => {
              const count = categoryCounts.get(category) ?? 0
              if (count === 0) return null
              return (
                <button
                  className={`folder-item ${activeCategory === category ? 'selected' : ''}`}
                  type='button'
                  key={category}
                  onClick={() => {
                    setActiveCategory(category)
                    document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
                  }}>
                  <span className='folder-dot' style={{ background: CATEGORY_META[category].color }} />
                  {category}
                  <span>{count}</span>
                </button>
              )
            })}
            {categoryCounts.size === 0 ? (
              <p className='folder-placeholder'>Folders appear as files are sorted.</p>
            ) : null}
          </div>
        </div>

        <div className='privacy-card'>
          <span className='privacy-icon'>
            <ShieldCheck size={19} />
          </span>
          <div>
            <strong>Private by design</strong>
            <p>OCR runs on this device before anything is uploaded.</p>
          </div>
        </div>
      </aside>
    </div>
  )
}
