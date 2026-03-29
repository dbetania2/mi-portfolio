import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Portpixel — Full Stack Developer',
  description: 'Portfolio de desarrollo web Full Stack',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}