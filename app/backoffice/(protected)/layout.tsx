import { connection } from 'next/server'
import { requireAdmin } from '@/lib/backoffice-auth'

// Verificación real de la sesión para todo el panel (el proxy solo hace un primer filtro).
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await connection()
  await requireAdmin()
  return children
}
