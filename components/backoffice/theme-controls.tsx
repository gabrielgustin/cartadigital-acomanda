'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { Switch, inputClass } from '@/components/backoffice/ui'
import { COLOR_DEFS, FONTS, resolveColor, type ColorDef, type FontDef, type Option, type ThemeSettings } from '@/lib/theme'
import { cn } from '@/lib/utils'

/** Título de un grupo de controles dentro de una pestaña. */
export function Group({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 rounded-lg border border-border bg-card p-5">
      <header>
        <h2 className="text-base font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </header>
      {children}
    </section>
  )
}

/** Elegir una opción entre pocas, con todas a la vista. */
export function Segmented<T extends string | number>({
  label,
  hint,
  options,
  value,
  onChange,
}: {
  label: string
  hint?: string
  options: readonly Option<T>[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="space-y-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div role="radiogroup" aria-label={label} className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr))]">
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex flex-col items-start rounded-md border px-3 py-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/60',
              )}
            >
              <span className="flex w-full items-center justify-between gap-2 text-sm font-medium">
                {option.label}
                {active && <Check className="h-4 w-4 text-primary" aria-hidden />}
              </span>
              {option.hint && <span className="text-xs text-muted-foreground">{option.hint}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function ToggleRow({ label, hint, checked, onChange }: { label: string; hint?: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch checked={checked} label={label} onChange={onChange} />
    </div>
  )
}

/** Un color del diseño: selector, código hexadecimal y vuelta al valor automático. */
export function ColorRow({ def, theme, onChange }: { def: ColorDef; theme: ThemeSettings; onChange: (value: string | null) => void }) {
  const own = theme[def.key]
  const shown = resolveColor(theme, def.key)
  const [text, setText] = useState(shown)
  const [lastShown, setLastShown] = useState(shown)

  // El campo de texto sigue al selector (y a "automático") pero deja escribir libremente.
  if (shown !== lastShown) {
    setLastShown(shown)
    setText(shown)
  }

  const inheritedFrom = def.inherits ? COLOR_DEFS.find((entry) => entry.key === def.inherits)?.label : null
  const autoNote = def.automatic ? 'Automático' : inheritedFrom ? `Igual que “${inheritedFrom}”` : 'Original'

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2">
      <input
        type="color"
        aria-label={`${def.label}: selector de color`}
        value={shown}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-card p-1"
      />
      <div className="min-w-0 flex-1 basis-48">
        <p className="text-sm font-medium">{def.label}</p>
        <p className="text-xs text-muted-foreground">{def.hint}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          aria-label={`${def.label}: código hexadecimal`}
          className={`${inputClass} h-9 w-28 font-mono uppercase`}
          value={text}
          maxLength={7}
          spellCheck={false}
          onChange={(event) => {
            const next = event.target.value.startsWith('#') ? event.target.value : `#${event.target.value}`
            setText(next)
            if (/^#[0-9a-f]{6}$/i.test(next)) onChange(next.toLowerCase())
          }}
        />
        {own ? (
          <button type="button" className="w-24 text-left text-xs font-semibold text-primary hover:underline" onClick={() => onChange(null)}>
            Restablecer
          </button>
        ) : (
          <span className="w-24 text-xs text-muted-foreground">{autoNote}</span>
        )}
      </div>
    </div>
  )
}

/** Lista de tipografías, cada una escrita con su propia letra. */
export function FontPicker({
  label,
  hint,
  value,
  original,
  sample,
  onChange,
}: {
  label: string
  hint: string
  value: string | null
  original: string
  sample: string
  onChange: (value: string | null) => void
}) {
  const kinds: FontDef['kind'][] = ['Con serifa', 'Sin serifa', 'Impacto', 'Manuscrita']
  const [kind, setKind] = useState<FontDef['kind'] | 'Todas'>('Todas')
  const current = value ?? original
  const visible = FONTS.filter((font) => kind === 'Todas' || font.kind === kind)

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Estilo de ${label.toLowerCase()}`}>
        {(['Todas', ...kinds] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            aria-pressed={kind === entry}
            onClick={() => setKind(entry)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
              kind === entry ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {entry}
          </button>
        ))}
      </div>
      <div role="radiogroup" aria-label={label} className="grid max-h-80 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
        {visible.map((font) => {
          const active = font.name === current
          return (
            <button
              key={font.name}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(font.name === original ? null : font.name)}
              className={cn(
                'rounded-md border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                active ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border bg-card hover:border-primary/60',
              )}
            >
              <span className="block truncate text-lg leading-tight" style={{ fontFamily: `"${font.name}", sans-serif` }}>
                {sample}
              </span>
              <span className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                {font.name}
                {font.name === original && <span className="rounded bg-muted px-1.5 py-0.5">Original</span>}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
