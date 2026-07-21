import type { HTMLProps } from 'react'
export type ClassName = HTMLProps<HTMLElement>['className']
// export type { LinkItem } from './profile'
export type VoidPromise = () => Promise<void>
export type { CategoryName, CategoryRule, Classification, QueueItem, QueueStatus, StoredFile } from './file'
