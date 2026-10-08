import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/backoffice-auth'

// Primera barrera: corta las visitas sin sesión antes de renderizar. Cada
// página, acción y ruta del backoffice vuelve a verificar la sesión por su cuenta.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/backoffice/login') return NextResponse.next()

  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next()

  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  return NextResponse.redirect(new URL('/backoffice/login', request.url))
}

export const config = {
  matcher: ['/backoffice/:path*', '/api/backoffice/:path*'],
}
