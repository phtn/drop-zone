import { CATEGORY_RULES, TEXT_EXTENSIONS } from '@/constants'
import { IconName } from '@/lib/icons'
import { CategoryRule, Classification } from '@/types'

export function fileExtension(name: string) {
  return name.split('.').pop()?.toLowerCase() ?? ''
}

export function fileKind(name: string, mimeType: string) {
  const extension = fileExtension(name)
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType === 'application/pdf' || extension === 'pdf') return 'PDF'
  if (['csv', 'xls', 'xlsx'].includes(extension)) return 'Spreadsheet'
  if (['doc', 'docx', 'odt', 'rtf'].includes(extension)) return 'Document'
  if (TEXT_EXTENSIONS.has(extension)) return 'Text file'
  return extension ? `${extension.toUpperCase()} file` : 'File'
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function truncate(value: string, length: number) {
  const compact = value.replace(/\s+/g, ' ').trim()
  return compact.length > length ? `${compact.slice(0, length).trim()}…` : compact
}

export function getFileIcon(name: string, mimeType: string): IconName {
  const extension = fileExtension(name)
  if (mimeType.startsWith('image/')) return 'image'
  if (['csv', 'xls', 'xlsx'].includes(extension)) {
    return 'table'
  }
  if (mimeType === 'application/pdf') {
    return 'file-pdf'
  }
  if (['doc', 'docx', 'txt', 'md', 'rtf'].includes(extension)) {
    return 'file'
  }
  return 'file'
}

export function inferFromName(file: globalThis.File): Classification {
  const haystack = `${file.name} ${file.type}`.toLowerCase()
  const result = classifyText(haystack, file)
  return {
    ...result,
    confidence: Math.min(result.confidence, 74),
    method: 'File type + filename'
  }
}

function classifyText(text: string, file: globalThis.File): Classification {
  const haystack = `${file.name}\n${text}`
  let best: { rule: CategoryRule; score: number } | null = null

  for (const rule of CATEGORY_RULES) {
    const matches = haystack.match(rule.terms)?.length ?? 0
    if (!best || matches > best.score) best = { rule, score: matches }
  }

  const fallbackKind = fileKind(file.name, file.type)
  if (!best || best.score === 0) {
    return {
      category: 'Other',
      kind: fallbackKind,
      confidence: text.trim().length > 30 ? 68 : 52,
      excerpt: truncate(text, 150),
      method: text.trim() ? 'Local text analysis' : 'File type + filename'
    }
  }

  const confidence = Math.min(96, 67 + best.score * 7 + (text.length > 120 ? 5 : 0))
  return {
    category: best.rule.category,
    kind: best.rule.kind,
    confidence,
    excerpt: truncate(text, 150),
    method: 'Local content analysis'
  }
}

async function recognizeImage(image: globalThis.File | HTMLCanvasElement, onProgress: (progress: number) => void) {
  const { createWorker } = await import('tesseract.js')
  const worker = await createWorker('eng', 1, {
    logger: (message) => {
      if (message.status === 'recognizing text') {
        onProgress(Math.max(8, Math.round(message.progress * 84)))
      }
    }
  })

  try {
    const result = await worker.recognize(image)
    return result.data.text
  } finally {
    await worker.terminate()
  }
}

async function extractPdfText(file: globalThis.File, onProgress: (progress: number) => void) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.mjs'

  const data = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data }).promise
  const pagesToRead = Math.min(pdf.numPages, 3)
  const chunks: string[] = []

  for (let pageNumber = 1; pageNumber <= pagesToRead; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber)
    const content = await page.getTextContent()
    chunks.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '))
    onProgress(Math.round((pageNumber / pagesToRead) * 75))
  }

  const extractedText = chunks.join('\n').trim()
  if (extractedText.length > 80) return extractedText

  const firstPage = await pdf.getPage(1)
  const viewport = firstPage.getViewport({ scale: 1.5 })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d', { alpha: false })
  if (!context) return extractedText

  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  await firstPage.render({ canvas, canvasContext: context, viewport }).promise
  const ocrText = await recognizeImage(canvas, onProgress)
  return `${extractedText}\n${ocrText}`.trim()
}

export async function analyzeFile(file: globalThis.File, onProgress: (progress: number) => void) {
  const extension = fileExtension(file.name)
  let text = ''
  let method = 'File type + filename'

  if (file.type.startsWith('image/')) {
    text = await recognizeImage(file, onProgress)
    method = 'On-device OCR'
  } else if (file.type === 'application/pdf' || extension === 'pdf') {
    text = await extractPdfText(file, onProgress)
    method = text.length > 80 ? 'Local PDF text + OCR' : method
  } else if (file.type.startsWith('text/') || TEXT_EXTENSIONS.has(extension)) {
    text = await file.text()
    onProgress(88)
    method = 'Local text analysis'
  }

  if (!text.trim()) return inferFromName(file)
  return { ...classifyText(text, file), method }
}
