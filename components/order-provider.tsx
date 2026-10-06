'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { itemsById, type MenuItem } from '@/lib/menu-data'

const STORAGE_KEY = 'la-comanda-order'

type Quantities = Record<string, number>

export interface OrderLine {
  item: MenuItem
  quantity: number
}

interface OrderContextValue {
  quantities: Quantities
  lines: OrderLine[]
  count: number
  total: number
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [quantities, setQuantities] = useState<Quantities>({})
  const [hydrated, setHydrated] = useState(false)

  // El pedido queda guardado en el dispositivo para que sobreviva a una recarga.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') {
          const restored: Quantities = {}
          for (const [id, quantity] of Object.entries(parsed)) {
            if (itemsById[id] && Number.isInteger(quantity) && (quantity as number) > 0) restored[id] = quantity as number
          }
          setQuantities(restored)
        }
      }
    } catch {}
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
    } catch {}
  }, [quantities, hydrated])

  const add = useCallback((id: string) => {
    setQuantities((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }, [])

  const remove = useCallback((id: string) => {
    setQuantities((current) => {
      const next = { ...current }
      if ((next[id] ?? 0) <= 1) delete next[id]
      else next[id] -= 1
      return next
    })
  }, [])

  const clear = useCallback(() => setQuantities({}), [])

  const value = useMemo<OrderContextValue>(() => {
    const lines = Object.entries(quantities)
      .map(([id, quantity]) => ({ item: itemsById[id], quantity }))
      .filter((line): line is OrderLine => Boolean(line.item))
    return {
      quantities,
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.item.price * line.quantity, 0),
      add,
      remove,
      clear,
    }
  }, [quantities, add, remove, clear])

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) throw new Error('useOrder debe usarse dentro de OrderProvider')
  return context
}
