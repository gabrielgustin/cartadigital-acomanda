import Link from 'next/link'
import { Lock } from 'lucide-react'

// Acceso discreto al login del backoffice, justo debajo del botón de idioma.
export function AdminLink() {
  return (
    <Link
      href="/backoffice/login"
      aria-label="Acceder al backoffice"
      className="absolute right-4 top-[3.25rem] z-10 flex items-center gap-1.5 rounded-pill border border-border bg-card px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 sm:right-6 sm:top-[4.25rem]"
    >
      <Lock className="h-3.5 w-3.5" aria-hidden />
      Admin
    </Link>
  )
}
