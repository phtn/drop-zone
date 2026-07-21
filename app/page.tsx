import { CATEGORY_NAMES } from '@/constants/meta'
import { StoredFile } from '@/types'
import { listStoredFiles, storageError, type FileRecord } from './api/files/storage'
import { FileDashboard } from './file-dashboard'

export const dynamic = 'force-dynamic'

function toStoredFile(record: FileRecord): StoredFile {
  const category = CATEGORY_NAMES.find((candidate) => candidate === record.category) ?? 'Other'
  return { ...record, category }
}

export default async function Home() {
  let initialLibrary: StoredFile[] = []
  let initialStorageNotice = ''

  try {
    initialLibrary = (await listStoredFiles()).map(toStoredFile)
  } catch (error) {
    initialStorageNotice = storageError(error)
  }

  return <FileDashboard initialLibrary={initialLibrary} initialStorageNotice={initialStorageNotice} />
}
