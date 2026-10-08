import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, LogOut } from 'lucide-react'
import { logout } from '@/app/backoffice/actions'
import { PreviewButton } from '@/components/backoffice/preview-button'

const headerButton =
  'inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60'

export function PageShell({
  title,
  backHref,
  width = 'max-w-5xl',
  children,
}: {
  title?: string
  backHref?: string
  width?: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 bg-[#1e4b8e] text-white">
        <div className={`mx-auto flex items-center justify-between gap-3 px-4 py-3 md:px-6 ${backHref ? 'max-w-5xl' : 'max-w-5xl md:py-4'}`}>
          <div className="flex min-w-0 items-center gap-3">
            {backHref ? (
              <>
                <Link href={backHref} aria-label="Volver al inicio del panel" className={`${headerButton} -ml-2 w-9 justify-center px-0`}>
                  <ArrowLeft className="h-5 w-5" aria-hidden />
                </Link>
                <h1 className="title-font truncate text-2xl font-semibold leading-tight text-primary-foreground md:text-3xl">{title}</h1>
              </>
            ) : (
              <Image src="/images/logoautogestiva.png" alt="Autogestiva" width={500} height={197} priority className="h-10 w-auto md:h-16" />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <PreviewButton className={headerButton} />
            <form action={logout}>
              <button type="submit" className={headerButton}>
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className={`mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 ${width}`}>{children}</main>
    </div>
  )
}
