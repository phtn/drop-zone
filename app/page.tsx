import { listStoredFiles, storageError, type FileRecord } from './api/files/storage'
import { FileDashboard, type StoredFile } from './file-dashboard'

export const dynamic = 'force-dynamic'

const CATEGORY_NAMES: StoredFile['category'][] = [
  'Receipts',
  'Finance',
  'Legal',
  'Identity',
  'Medical',
  'Travel',
  'Work',
  'Personal',
  'Other'
]

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
