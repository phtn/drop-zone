import { Icon } from '@/lib/icons'
import { Plus, Search } from 'lucide-react'
import { RefObject } from 'react'

interface MobileHeaderProps {
  search: string
  setSearch: (value: string) => void
  inputRef: RefObject<HTMLInputElement | null>
}

export function MobileHeader({ search, setSearch, inputRef }: MobileHeaderProps) {
  return (
    <header className='topbar'>
      <button className='mobile-brand' type='button' aria-label='Dropwell home'>
        <Icon name='re-up.ph' />
      </button>
      <label className='search-field'>
        <Search size={17} />
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
          <span /> Local OCR
        </span>
        <button className='add-files-button' type='button' onClick={() => inputRef.current?.click()}>
          <Plus size={17} />
          Add files
        </button>
      </div>
    </header>
  )
}
