'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
const CLOSE_DELAY = 220

interface ModalProps {
  labelledBy: string
  onClose: () => void
  className?: string
  children: (close: () => void) => React.ReactNode
}

// Diálogo modal accesible: atrapa el foco, se cierra con Esc o tocando afuera,
// bloquea el scroll del fondo y devuelve el foco al elemento que lo abrió.
export function Modal({ labelledBy, onClose, className, children }: ModalProps) {
  const [isClosing, setIsClosing] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const closingRef = useRef(false)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  const close = useCallback(() => {
    if (closingRef.current) return
    closingRef.current = true
    setIsClosing(true)
    window.setTimeout(() => onCloseRef.current(), CLOSE_DELAY)
  }, [])

  useEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null

    const focusables = () => Array.from(sheet.querySelectorAll<HTMLElement>(FOCUSABLE))

    const initial = sheet.querySelector<HTMLElement>('[data-autofocus]') ?? focusables()[0] ?? sheet
    initial.focus({ preventScroll: true })

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'Tab') return
      const items = focusables()
      if (!items.length) {
        event.preventDefault()
        sheet.focus()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement
      if (event.shiftKey && (active === first || !sheet.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !sheet.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKeyDown)
      opener?.focus({ preventScroll: true })
    }
  }, [close])

  return createPortal(
    <div
      className={cn('product-overlay fixed inset-0 z-[100] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm sm:p-5', isClosing && 'product-overlay-out')}
      role="presentation"
      onClick={close}
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={cn('product-sheet max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-3xl border border-border bg-card shadow-2xl outline-none', isClosing && 'product-sheet-out', className)}
      >
        {children(close)}
      </div>
    </div>,
    document.body,
  )
}
