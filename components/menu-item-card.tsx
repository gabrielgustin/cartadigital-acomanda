'use client'

import Image from 'next/image'
import { useLanguage } from '@/components/language-provider'
import { useOrder } from '@/components/order-provider'
import { QuantityStepper } from '@/components/quantity-stepper'
import { formatPrice } from '@/lib/format'
import type { MenuItem } from '@/lib/menu-data'

interface MenuItemCardProps {
  item: MenuItem
  image: string
  onOpen: (item: MenuItem) => void
}

export function MenuItemCard({ item, image, onOpen }: MenuItemCardProps) {
  const { lang, t } = useLanguage()
  const { quantities, add, remove } = useOrder()
  const name = item.name[lang]

  return (
    <article className="group relative flex items-center gap-4 border-b border-border/70 py-4 transition hover:bg-muted/30">
      <Image
        src={image}
        alt=""
        width={96}
        height={96}
        sizes="(min-width: 640px) 96px, 80px"
        className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-border transition duration-300 group-hover:scale-[1.03] group-hover:ring-primary/60 sm:h-24 sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <h3 className="font-serif text-base uppercase tracking-wide text-foreground group-hover:text-primary">
          {/* El botón cubre toda la tarjeta (after:inset-0); el stepper queda por encima con z-10. */}
          <button
            type="button"
            onClick={() => onOpen(item)}
            className="cursor-pointer break-words text-left uppercase outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary/50"
          >
            {name}
          </button>
        </h3>
        <p className="mt-1.5 max-w-lg text-sm leading-6 text-muted-foreground">{item.description[lang]}</p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="font-serif text-base font-bold tracking-wide text-primary">
            <span className="sr-only">{t.price} </span>
            {formatPrice(item.price)}
          </span>
          <div className="relative z-10">
            <QuantityStepper name={name} quantity={quantities[item.id] ?? 0} onAdd={() => add(item.id)} onRemove={() => remove(item.id)} />
          </div>
        </div>
      </div>
    </article>
  )
}
