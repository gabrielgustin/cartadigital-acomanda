'use client'

import { useState, useTransition } from 'react'
import { cn } from '@/lib/utils'
import type { ActionResult } from '@/app/backoffice/actions'

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background'
const buttonBase = `inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:pointer-events-none disabled:opacity-50 ${focusRing}`

export const btnPrimary = `${buttonBase} bg-primary text-primary-foreground hover:bg-primary/90`
export const btnOutline = `${buttonBase} border border-border bg-card text-foreground hover:border-primary hover:text-primary`
export const btnDanger = `${buttonBase} bg-red-700 text-white hover:bg-red-800`
export const btnIcon = `inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:border-primary hover:text-primary disabled:pointer-events-none disabled:opacity-35 ${focusRing}`

export const inputClass = `h-11 w-full rounded-md border border-border bg-card px-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20`

export function Field({ label, hint, children, className }: { label: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn('block space-y-1.5', className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="block text-xs text-muted-foreground">{hint}</span>}
    </label>
  )
}

export function Switch({ checked, onChange, label, disabled }: { checked: boolean; onChange: (value: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        `relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50 ${focusRing}`,
        checked ? 'bg-primary' : 'bg-muted-foreground/30',
      )}
    >
      <span className={cn('absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform', checked && 'translate-x-5')} />
    </button>
  )
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
      {message}
    </p>
  )
}

/** Ejecuta una acción del servidor mostrando "pendiente" y el error si falla. */
export function useRunner() {
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const run = (action: () => Promise<ActionResult>, onDone?: () => void) =>
    start(async () => {
      try {
        const result = await action()
        if (result.ok) {
          setError(null)
          onDone?.()
        } else setError(result.error)
      } catch {
        setError('No se pudo completar la acción. Probá de nuevo.')
      }
    })

  return { pending, error, setError, run }
}
