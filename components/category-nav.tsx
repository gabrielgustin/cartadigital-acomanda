'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '@/components/language-provider'
import { useSiteTheme } from '@/components/site-theme'
import { getCategoryIcon } from '@/lib/category-icons'

interface CategoryNavProps {
  sections: { id: string; label: string; icon: string }[]
  activeSection: string
  onSelect: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void
}

export function CategoryNav({ sections, activeSection, onSelect }: CategoryNavProps) {
  const { t } = useLanguage()
  const { showCategoryIcons } = useSiteTheme()
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pillRect, setPillRect] = useState({ width: 0, height: 0, left: 0 })
  const activeSectionRef = useRef(activeSection)

  // Cambia al filtrar o al traducir: ambos alteran el ancho y la posición de los links.
  const linksKey = sections.map(({ id, label }) => `${id}:${label}`).join('|')

  const activeIndex = sections.findIndex(({ id }) => id === activeSection)
  const previousIndexRef = useRef(activeIndex)
  const paintDirectionRef = useRef<'right' | 'left'>('right')
  if (activeIndex !== previousIndexRef.current) {
    paintDirectionRef.current = activeIndex > previousIndexRef.current ? 'right' : 'left'
    previousIndexRef.current = activeIndex
  }

  useLayoutEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // La píldora vive DENTRO del <nav> como hijo absoluto, medida con el
  // offsetLeft/offsetWidth del link activo. Como su bloque contenedor es el
  // propio elemento scrolleable, el navegador la mueve junto con los links sin
  // JS por frame (lo que antes causaba temblor). Este efecto solo vuelve a
  // medir cuando el layout cambia por fuera de la navegación: al terminar de
  // cargar las fuentes o al redimensionar.
  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return

    const syncPillInstant = () => {
      const activeLink = linkRefs.current[activeSectionRef.current]
      if (!activeLink) return
      setPillRect({ width: activeLink.offsetWidth, height: activeLink.offsetHeight, left: activeLink.offsetLeft })
    }

    syncPillInstant()
    document.fonts?.ready?.then(syncPillInstant)

    const resizeObserver = new ResizeObserver(syncPillInstant)
    resizeObserver.observe(nav)

    return () => resizeObserver.disconnect()
  }, [])

  // En cada cambio de categoría (click o scroll) la píldora se redimensiona y
  // reposiciona al instante sobre el nuevo link, y el nav se centra sin
  // animar para no "viajar" por las categorías intermedias.
  useLayoutEffect(() => {
    const nav = navRef.current
    const activeLink = linkRefs.current[activeSection]
    if (!nav || !activeLink) return

    setPillRect({ width: activeLink.offsetWidth, height: activeLink.offsetHeight, left: activeLink.offsetLeft })

    const navRect = nav.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const distance = linkRect.left + linkRect.width / 2 - (navRect.left + navRect.width / 2)

    const target = Math.max(0, Math.min(nav.scrollLeft + distance, nav.scrollWidth - nav.clientWidth))
    nav.scrollTo({ left: target, behavior: 'auto' })
  }, [activeSection, linksKey])

  return (
    <nav ref={navRef} className="scrollbar-hide relative flex min-h-16 gap-2 overflow-x-auto px-5 py-4 sm:min-h-14 sm:py-3" style={{ willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }} aria-label={t.categoriesLabel}>
      <div
        key={activeSection}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-0 my-auto"
        style={{ width: pillRect.width, height: pillRect.height, left: pillRect.left }}
      >
        <span className="absolute inset-0 rounded-pill border border-border bg-card" />
        <span className={`pill-paint ${paintDirectionRef.current === 'left' ? 'pill-paint-left' : ''} absolute inset-0 rounded-pill shadow-md shadow-pill/20`} />
      </div>
      {sections.map(({ id, label, icon }) => {
        const Icon = getCategoryIcon(icon)
        return (
          <a
            key={id}
            ref={(el) => {
              linkRefs.current[id] = el
            }}
            data-category={id}
            href={`#${id}`}
            onClick={(event) => onSelect(event, id)}
            aria-current={activeSection === id ? 'true' : undefined}
            className={`relative z-10 flex shrink-0 items-center gap-2 rounded-pill border px-3.5 py-2 text-xs font-semibold transition-colors duration-300 ease-out ${activeSection === id ? 'delay-100 border-transparent bg-transparent text-pill-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}
          >
            {showCategoryIcons && <Icon className="h-3.5 w-3.5" aria-hidden />}
            {label}
          </a>
        )
      })}
    </nav>
  )
}
