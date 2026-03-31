import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'

export const metadata: Metadata = {
  title: 'Daiana Del Grecco | Desarrolladora Full Stack & Automatización',
  description:
    'Portfolio con proyectos de desarrollo web Full Stack, automatización de procesos y diseño de interfaces.',

  // Configuración del Favicon SVG
  icons: {
    icon: [
      {
        url: '/DG.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: '/DG.svg',
    apple: '/DG.svg',
  },

  openGraph: {
    title: 'Daiana Del Grecco',
    description:
      'Desarrollo web, automatización de procesos y diseño de interfaces.',
    url: 'daianadg-portfolio.vercel.app', 
    siteName: 'Portfolio Daiana',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Portfolio de Daiana Del Grecco',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Daiana Del Grecco',
    description:
      'Portfolio de desarrollo web, automatización y diseño de interfaces.',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}