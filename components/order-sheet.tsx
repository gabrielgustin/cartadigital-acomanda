'use client'

import { useState } from 'react'
import { ClipboardList, X } from 'lucide-react'
import { useLanguage } from '@/components/language-provider'
import { Modal } from '@/components/modal'
import { useOrder } from '@/components/order-provider'
import { QuantityStepper } from '@/components/quantity-stepper'
import { formatPrice } from '@/lib/format'

// Barra fija con el resumen del pedido + hoja con el detalle para mostrarle al mozo.
export function OrderBar() {
  const { lang, t } = useLanguage()
  const { lines, count, total, add, remove, clear } = useOrder()
  const [open, setOpen] = useState(false)

  return (
    <>
      {count > 0 && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-4 rounded-full bg-primary px-5 py-3.5 text-primary-foreground shadow-xl shadow-primary/30 transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span className="flex items-center gap-2.5 text-sm font-semibold">
              <ClipboardList className="h-5 w-5" aria-hidden />
              {t.viewOrder}
              <span className="rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">{t.itemsCount(count)}</span>
            </span>
            <span className="font-serif text-sm tracking-wide">{formatPrice(total)}</span>
          </button>
        </div>
      )}

      {open && (
        <Modal labelledBy="order-dialog-title" onClose={() => setOpen(false)}>
          {(close) => (
            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4 border-b border-border p-6 pb-4">
                <div>
                  <h2 id="order-dialog-title" className="font-serif text-2xl uppercase tracking-wide text-foreground">
                    {t.orderTitle}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{t.orderHint}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  aria-label={t.closeOrder}
                  className="shrink-0 rounded-full bg-muted p-2 text-foreground transition hover:bg-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <X className="h-5 w-5" aria-hidden />
                </button>
              </div>

              {lines.length === 0 ? (
                <p className="p-6 text-sm text-muted-foreground">{t.orderEmpty}</p>
              ) : (
                <>
                  <ul className="divide-y divide-border/70 px-6">
                    {lines.map(({ item, quantity }) => (
                      <li key={item.id} className="flex items-center justify-between gap-3 py-3.5">
                        <div className="min-w-0">
                          <p className="font-serif text-sm uppercase tracking-wide text-foreground">{item.name[lang]}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{formatPrice(item.price * quantity)}</p>
                        </div>
                        <QuantityStepper name={item.name[lang]} quantity={quantity} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-3 border-t border-border p-6">
                    <p className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t.estimatedTotal}</span>
                      <span className="font-serif text-xl text-primary">{formatPrice(total)}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        clear()
                        close()
                      }}
                      className="w-full rounded-full border border-border py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    >
                      {t.clearOrder}
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
