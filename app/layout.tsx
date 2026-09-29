import { Analytics } from '@vercel/analytics/next'
import { Bevan, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const bevan = Bevan({ subsets: ['latin'], weight: '400', variable: '--font-bevan' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'La Comanda | Carta digital',
  description: 'Carta digital de La Comanda. Sabores honestos para compartir.',
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/logo-la-comanda.svg', type: 'image/svg+xml' }],
    apple: '/logo-la-comanda.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`bg-background ${bevan.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
