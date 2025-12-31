import type { Metadata } from 'next'
import '../src/globals.css'

export const metadata: Metadata = {
  title: 'Skinstric',
  description: 'Sophisticated skincare',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

