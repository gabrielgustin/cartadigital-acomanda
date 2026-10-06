'use client'

import { useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { CategoryNav } from '@/components/category-nav'
import { LanguageToggle } from '@/components/language-toggle'
import { useLanguage } from '@/components/language-provider'
import { MenuItemCard } from '@/components/menu-item-card'
import { OrderBar } from '@/components/order-sheet'
import { useOrder } from '@/components/order-provider'
import { ProductDialog } from '@/components/product-dialog'
import { normalizeText } from '@/lib/format'
import { availableTags, menu, type MenuItem, type Tag } from '@/lib/menu-data'
import { useActiveSection } from '@/lib/use-active-section'

const LOGO_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolacomanda-VNpRbPJh01Eae6IUkvUaEkNgdUZQTm.webp'
const FOOTER_URL = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/n-lVCemyWt8jQsqth5SSB8kXA3IgLsyn.png'

export function MenuExperience() {
  const { lang, t } = useLanguage()
  const { count } = useOrder()
  const [query, setQuery] = useState('')
  const [activeTags, setActiveTags] = useState<Tag[]>([])
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const stickyRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const needle = normalizeText(query.trim())
    return menu
      .map((section) => ({
        ...section,
        items: section.items.filter(
          (item) =>
            activeTags.every((tag) => item.tags.includes(tag)) &&
            normalizeText(`${item.name[lang]} ${item.description[lang]}`).includes(needle),
        ),
      }))
      .filter((section) => section.items.length > 0)
  }, [query, activeTags, lang])

  const { activeSection, selectSection } = useActiveSection(
    filtered.map((section) => section.id),
    stickyRef,
  )

  const resultCount = filtered.reduce((sum, section) => sum + section.items.length, 0)
  const isFiltering = query.trim() !== '' || activeTags.length > 0
  const selectedSection = selectedItem ? menu.find((section) => section.id === selectedItem.sectionId) : undefined

  const toggleTag = (tag: Tag) => setActiveTags((current) => (current.includes(tag) ? current.filter((entry) => entry !== tag) : [...current, tag]))
  const clearFilters = () => {
    setQuery('')
    setActiveTags([])
  }

  return (
    <main className={`min-h-screen bg-background text-foreground ${count > 0 ? 'pb-24' : ''}`}>
      <header className="hero-pattern relative border-b border-border">
        <LanguageToggle />
        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-6 pt-4 text-center sm:pb-8 sm:pt-6">
          <Image src={LOGO_URL} alt={t.logoAlt} width={208} height={208} priority className="h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52" />
        </div>
      </header>

      <div ref={stickyRef} className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl">
          <CategoryNav sections={filtered.map((section) => ({ id: section.id, label: section.label[lang] }))} activeSection={activeSection} onSelect={selectSection} />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:pt-12">
        <div className="mx-auto mb-12 max-w-xl space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              aria-label={t.searchLabel}
            />
          </div>
          {availableTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2" role="group" aria-label={t.filtersLabel}>
              {availableTags.map((tag) => {
                const active = activeTags.includes(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    aria-pressed={active}
                    className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}
                  >
                    {t.tags[tag]}
                  </button>
                )
              })}
            </div>
          )}
          <p className="sr-only" aria-live="polite">
            {isFiltering ? t.resultsCount(resultCount) : ''}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">{t.noResults}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-primary transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              {t.clearFilters}
            </button>
          </div>
        ) : (
          <div className="space-y-14">
            {filtered.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24" aria-labelledby={`${section.id}-title`}>
                <div className="mb-6 flex items-end justify-between border-b border-border pb-4">
                  <div>
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">{section.eyebrow[lang]}</p>
                    <h2 id={`${section.id}-title`} className="font-serif text-3xl uppercase tracking-wide text-foreground sm:text-4xl">
                      {section.title[lang]}
                    </h2>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} image={section.image} onOpen={setSelectedItem} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      {selectedItem && selectedSection && <ProductDialog item={selectedItem} section={selectedSection} onClose={() => setSelectedItem(null)} />}
      <OrderBar />

      <footer className="border-t border-border bg-card px-5 py-6 text-center">
        <Image src={FOOTER_URL} alt={t.footerAlt} width={144} height={144} className="mx-auto h-36 w-36 object-contain" />
      </footer>
    </main>
  )
}
