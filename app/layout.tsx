import { Analytics } from '@vercel/analytics/next'
import { Bevan, DM_Sans } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import { LanguageProvider } from '@/components/language-provider'
import { OrderProvider } from '@/components/order-provider'
import './globals.css'

const bevan = Bevan({ subsets: ['latin'], weight: '400', variable: '--font-bevan' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' })

const title = 'La Comanda | Carta digital'
const description = 'Carta digital de La Comanda. Sabores honestos para compartir.'
const shareImage = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolacomanda-VNpRbPJh01Eae6IUkvUaEkNgdUZQTm.webp'

export const metadata: Metadata = {
  title,
  description,
  generator: 'v0.app',
  icons: {
    icon: [{ url: '/logo-la-comanda.svg', type: 'image/svg+xml' }],
    apple: '/logo-la-comanda.svg',
  },
  openGraph: {
    title,
    description,
    type: 'website',
    locale: 'es_AR',
    siteName: 'La Comanda',
    images: [{ url: shareImage, alt: 'La Comanda' }],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: [shareImage],
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
        <LanguageProvider>
          <OrderProvider>{children}</OrderProvider>
        </LanguageProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
