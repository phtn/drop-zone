import { Icon } from '@/lib/icons'
import type { RefObject } from 'react'

interface MobileHeaderProps {
  search: string
  setSearch: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}

export function MobileHeader({ search, setSearch, inputRef }: MobileHeaderProps) {
  return (
    <header className='topbar'>
      <div className='brand' aria-label='Dropwell home'>
        <Icon name='re-up.ph' className='size-4' />
        <span className='tracking-wider'>dropzone</span>
      </div>

      <nav className='topbar-nav' aria-label='Workspace navigation'>
        <button className='active' type='button'>
          <Icon name='files' size={17} />
          <span className='font-normal text-base'>Files</span>
        </button>
        <button type='button'>
          <Icon name='activity' />

          <span className='font-normal text-base'>Activity</span>
        </button>
        <button type='button'>
          <Icon name='sparkles' />

          <span className='font-normal text-base'>Automations</span>
        </button>
      </nav>

      <label className='search-field'>
        <Icon name='search' />
        <input
          type='search'
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder='Search your files'
          aria-label='Search your files'
        />
        <kbd>⌘ K</kbd>
      </label>
      <div className='topbar-actions'>
        <span className='local-status'>
          <span /> Private OCR
        </span>
        <button className='notification-button' type='button' aria-label='Notifications'>
          <Icon name='bell' />
          <span />
        </button>
        <button className='add-files-button' type='button' onClick={() => inputRef.current?.click()}>
          <Icon name='add' />
          Add new
        </button>
      </div>
    </header>
  )
}
