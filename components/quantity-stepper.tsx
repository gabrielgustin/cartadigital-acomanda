'use client'

import { Minus, Plus } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'

interface QuantityStepperProps {
  name: string
  quantity: number
  onAdd: () => void
  onRemove: () => void
}

const baseClass =
  'flex h-8 w-8 items-center justify-center rounded-pill border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-button/60'
const buttonClass = `${baseClass} border-border bg-card text-button hover:border-button`
const addClass = `${baseClass} border-transparent bg-button text-button-foreground hover:bg-button/90`

// Sin unidades muestra solo "+"; con unidades muestra "− n +".
export function QuantityStepper({ name, quantity, onAdd, onRemove }: QuantityStepperProps) {
  const { t } = useLanguage()

  if (quantity === 0) {
    return (
      <button type="button" onClick={onAdd} aria-label={t.addOne(name)} className={addClass}>
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2" role="group" aria-label={`${t.quantity}: ${name}`}>
      <button type="button" onClick={onRemove} aria-label={t.removeOne(name)} className={buttonClass}>
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-foreground" aria-live="polite">
        {quantity}
      </span>
      <button type="button" onClick={onAdd} aria-label={t.addOne(name)} className={buttonClass}>
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  )
}
