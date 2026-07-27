import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers()
  const host = requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? 'localhost:3000'
  const protocol = requestHeaders.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  const socialImage = `${protocol}://${host}/dropzone-og.png`

  return {
    title: 'DropZone — Local-first file organizer',
    description:
      'Drop files, classify their contents with private on-device OCR, and keep every document organized automatically.',
    icons: { icon: '/favicon.ico' },
    openGraph: {
      title: "DropZone — Drop it. We'll sort it.",
      description: 'Private, local-first file classification with a fast multi-file upload queue.',
      type: 'website',
      images: [
        {
          url: socialImage,
          width: 1731,
          height: 909,
          alt: 'DropZone file organizer'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: "DropZone — Drop it. We'll sort it.",
      description: 'Private, local-first file classification with a fast multi-file upload queue.',
      images: [socialImage]
    }
  }
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  )
}
