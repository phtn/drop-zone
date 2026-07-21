import { CategoryName, CategoryRule, QueueStatus, StoredFile } from '@/types'

export const CATEGORY_NAMES: StoredFile['category'][] = [
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
export const CATEGORY_META: Record<CategoryName, { color: string; background: string }> = {
  Receipts: { color: '#a44b14', background: '#fff0df' },
  Finance: { color: '#3f6d51', background: '#eaf5eb' },
  Legal: { color: '#76562b', background: '#f5eedf' },
  Identity: { color: '#4b5b9b', background: '#edf0ff' },
  Medical: { color: '#9a4661', background: '#faeaf0' },
  Travel: { color: '#287086', background: '#e7f5f8' },
  Work: { color: '#7851a9', background: '#f1ebfa' },
  Personal: { color: '#816638', background: '#f7f0df' },
  Other: { color: '#5f625e', background: '#eceeeb' },
  All: { color: '#5f625e', background: '#eceeeb' }
}

export const TEXT_EXTENSIONS = new Set(['txt', 'md', 'csv', 'json', 'xml', 'html', 'log', 'rtf'])

export const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Receipts',
    kind: 'Receipt',
    terms: /\b(receipt|subtotal|total due|amount due|cashier|change|thank you for your purchase|vat|invoice no)\b/gi
  },
  {
    category: 'Finance',
    kind: 'Financial document',
    terms: /\b(bank|statement|account number|balance|deposit|withdrawal|tax|interest|payroll|salary|invoice)\b/gi
  },
  {
    category: 'Legal',
    kind: 'Legal document',
    terms: /\b(agreement|contract|party|terms and conditions|hereby|witnesseth|liability|confidential|signature)\b/gi
  },
  {
    category: 'Identity',
    kind: 'Identity document',
    terms: /\b(passport|driver'?s license|national id|date of birth|citizenship|identity card|surname)\b/gi
  },
  {
    category: 'Medical',
    kind: 'Medical record',
    terms: /\b(patient|diagnosis|prescription|physician|clinic|hospital|laboratory|dosage|medical)\b/gi
  },
  {
    category: 'Travel',
    kind: 'Travel document',
    terms: /\b(boarding pass|flight|booking|reservation|departure|arrival|hotel|itinerary|gate|seat)\b/gi
  },
  {
    category: 'Work',
    kind: 'Work document',
    terms: /\b(project|proposal|meeting|agenda|minutes|quarterly|client|deliverable|roadmap|report)\b/gi
  },
  {
    category: 'Personal',
    kind: 'Personal document',
    terms: /\b(resume|curriculum vitae|education|family|personal|certificate|invitation|letter)\b/gi
  }
]

export const STATUS_COPY: Record<QueueStatus, string> = {
  queued: 'Waiting in queue',
  reading: 'Reading contents locally',
  classifying: 'Choosing the best folder',
  uploading: 'Saving to your local library',
  done: 'Filed and ready',
  error: 'Needs attention'
}
