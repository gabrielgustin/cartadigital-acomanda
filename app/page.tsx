'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Search, Utensils, Wine, Beer, Salad, Pizza, Sandwich, Baby } from 'lucide-react'

const sections = [
  { id: 'sandwiches', label: 'Sandwiches', icon: Sandwich },
  { id: 'burgers', label: 'Burgers', icon: Utensils },
  { id: 'pizzas', label: 'Pizzas', icon: Pizza },
  { id: 'entradas', label: 'Entradas', icon: Salad },
  { id: 'principales', label: 'Principales', icon: Utensils },
  { id: 'mexicana', label: 'Mexicana', icon: Utensils },
  { id: 'bebidas', label: 'Bebidas', icon: Wine },
  { id: 'cervezas', label: 'Cervezas', icon: Beer },
  { id: 'infantil', label: 'Infantil', icon: Baby },
]

const menu = [
  { id: 'sandwiches', title: 'Sandwiches especiales', eyebrow: 'Lo bueno se comparte', items: [
    ['Entraña', 'Mayonesa casera, entraña braseada, rúcula, champiñones, tomate confitado y papas fritas'],
    ['Molleja', 'Mayonesa casera, mollejitas grilladas al limón, queso Chubut, lechuga, tomate y papas fritas'],
    ['Bife de chorizo', 'Mayonesa casera, bife de chorizo a la plancha, queso Chubut, huevo, lechuga, tomate y papas fritas'],
    ['Bondiola de cerdo', 'Bondiola braseada, coleslaw, pepinillos caseros, cebollas crispy, mostanesa y barbacoa casera'],
    ['Vacío braseado', 'Vacío braseado, salsa balsámica, mayonesa casera, queso Chubut, lechuga, tomate, huevo y papas fritas'],
    ['Vegetariano', 'Berenjena, cebolla, pimiento, huevo, queso, champiñón, lechuga y tomate'],
  ]},
  { id: 'burgers', title: 'Burgers', eyebrow: 'Hechas para ensuciarse las manos', items: [
    ['Clásica', '200 gr. de carne, mayonesa casera, huevo, queso, lechuga, tomate, pan brioche y papas fritas'],
    ['Bacon', '200 gr. de carne, panceta, cebollita caramelizada, cheddar, lechuga, tomate, pan brioche y papas fritas'],
    ['Blue cheese', '200 gr. de carne, mayonesa casera, rúcula, queso azul, huevo, cebolla y papas fritas'],
    ['De costillas', 'Medallón de costilla 200 gr., cheddar x2, panceta, cebolla crispy, pepinillos y papas fritas'],
    ['Lomos 150 gr.', 'Pan pita, bife de lomo, lechuga, tomate, queso, huevo, mayonesa casera y papas fritas'],
  ]},
  { id: 'pizzas', title: 'Pizzas', eyebrow: 'La mejor idea fue invitarte', items: [
    ['Mozzarella', 'Salsa de tomate, mozzarella y orégano'], ['Napolitana', 'Salsa de tomate, mozzarella y tomate en rodajas'], ['Napo con jamón', 'Salsa de tomate, mozzarella, tomate en rodajas, jamón y oliva saborizada'], ['Rúcula', 'Salsa de tomate, mozzarella, jamón crudo, rúcula y parmesano'], ['Palmitos', 'Salsa de tomate, mozzarella, jamón cocido, palmitos y salsa golf'], ['La Comanda', 'Salsa de tomate, mozzarella, verdeo, panceta, pollo y champiñones'], ['Del bosque', 'Salsa de tomate, mozzarella, rúcula, pera, roquefort y nuez'], ['Cuatro quesos', 'Salsa de tomate, mozzarella, provolone, sardo y roquefort'], ['Provenzal', 'Salsa de tomate, mozzarella, ajo y perejil'], ['Fugazzetta', 'Salsa de tomate, mozzarella y cebolla dorada'], ['Calabresa', 'Salsa de tomate, mozzarella y salame'], ['Carbonara', 'Salsa de tomate, mozzarella, panceta, huevo y parmesano'],
  ]},
  { id: 'entradas', title: 'Entradas', eyebrow: 'Para arrancar', items: [['Papas fritas', 'Papas fritas bastón'], ['Papas con huevo', 'Papas fritas bastón y huevos revueltos'], ['Papas jodidas', 'Papas fritas, cheddar, huevo, panceta, verdeo y chile opcional'], ['Provoleta con chutney', 'Provoleta, chutney de tomate y almendras'], ['Provoleta con verdeo', 'Provoleta, verdeo y pimentón'], ['Pinchos de langostinos', 'Langostino empanizado, salsa provenzal y papas fritas']]},
  { id: 'principales', title: 'Platos principales', eyebrow: 'El centro de la mesa', items: [['Bife de chorizo criollo', 'Bife de chorizo de 400 gr., salsa criolla, huevo frito y papas rústicas'], ['Bife con champiñones', 'Bife de chorizo de 400 gr., salsa de champiñones, crema y papas rústicas']]},
  { id: 'mexicana', title: 'Comida mexicana', eyebrow: 'Armala como más te guste', items: [['Fajitas', 'Carne a elección: ternera, pollo o cerdo, cebolla, pimientos, seis tortillas y seis salsas'], ['Quesadilla de champiñones', 'Dos tortillas de trigo, pollo, muzarella, champiñones y dos salsas'], ['Quesadilla jamón y muzarella', 'Dos tortillas de trigo, pollo, jamón, muzarella y dos salsas']]},
  { id: 'bebidas', title: 'Tragos & bebidas', eyebrow: 'Para brindar', items: [['Mojito', 'Lima, menta, azúcar, ron blanco y Sprite'], ['Fernet branca con coca', 'Fernet Branca y Coca Cola'], ['Campari con naranja', 'Campari, jugo de naranja y rodaja de naranja'], ['Gin tonic', 'Gin Mediterráneo, almíbar de romero, agua tónica y frutos rojos'], ['Caipiriña', 'Lima, azúcar y cachaça'], ['Whisky sour', 'Whisky, clara de huevo, almíbar y jugo de limón'], ['Negroni', 'Gin, Campari, vermouth y naranja'], ['Vinos', 'Nicasia, Estiba y Álamos. Consultar variedades disponibles.']]},
  { id: 'cervezas', title: 'Cervezas', eyebrow: 'Bien frías', items: [['Heineken 1 lt.', 'Botella'], ['Sol 1 lt.', 'Botella'], ['Miller 1 lt.', 'Botella'], ['Imperial IPA 1 lt.', 'Botella'], ['Imperial Amber Lager 1 lt.', 'Botella'], ['Imperial Stout 1 lt.', 'Negra'], ['Chopp pinta', 'Imperial Lager 530 cc'], ['Chopp 1/2 pinta', 'Imperial Lager 330 cc']]},
  { id: 'infantil', title: 'Menú infantil', eyebrow: 'Para los más chicos', items: [['Hamburguesa con papas', 'Hamburguesa de carne, queso, lechuga y tomate opcional, papas fritas'], ['Milanesita de ternera', 'Milanesita de ternera y papas fritas']]},
]

const fictitiousPrices: Record<string, number> = {
  sandwiches: 8900,
  burgers: 8200,
  pizzas: 9800,
  entradas: 5200,
  principales: 14500,
  mexicana: 7600,
  bebidas: 4800,
  cervezas: 4200,
  infantil: 6500,
}

const formatPrice = (sectionId: string, itemIndex: number) => {
  const base = fictitiousPrices[sectionId] ?? 5000
  const step = sectionId === 'pizzas' ? 650 : sectionId === 'bebidas' ? 450 : 550
  return `$${(base + itemIndex * step).toLocaleString('es-AR')}`
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(sections[0].id)

  const stickyRef = useRef<HTMLDivElement>(null)

  // Shared with handleCategoryClick below: the click handler scrolls a
  // section's top to exactly this offset from the sticky nav, so the
  // detection line here must use the identical value. A mismatch means the
  // section the user just clicked into lands a few px past the detection
  // line, and the very next scroll-driven detection tick reverts the pill to
  // the previous category right after the click set it correctly.
  const sectionOffset = 12

  // Deterministic, position-based section detection instead of
  // IntersectionObserver. A sorted-by-boundingClientRect approach can flip
  // ordering between two overlapping entries mid-scroll (both technically
  // "intersecting" for a frame), which briefly commits to the wrong section
  // and shows up as the highlight jumping back and forth. Checking each
  // section's top against a fixed detection line, in document order, gives
  // one stable answer per scroll position with no flicker.
  useEffect(() => {
    const sectionEls = sections.map(({ id }) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    let ticking = false

    const getLine = () => (stickyRef.current?.getBoundingClientRect().height ?? 0) + sectionOffset

    const update = () => {
      ticking = false
      if (!sectionEls.length) return
      const line = getLine()
      let current = sectionEls[0].id
      for (const el of sectionEls) {
        if (el.getBoundingClientRect().top <= line) current = el.id
        else break
      }
      setActiveSection((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const navAnimationFrame = useRef<number | null>(null)
  const [pillRect, setPillRect] = useState({ width: 0, height: 0, left: 0 })
  const activeSectionRef = useRef(activeSection)

  useEffect(() => {
    activeSectionRef.current = activeSection
  }, [activeSection])

  // The pill now lives INSIDE <nav> as a normal absolutely-positioned child,
  // sized and placed with the active link's own offsetLeft/offsetWidth (both
  // measured relative to nav's own padding box, since nav is `position:
  // relative`). Because its containing block is the scrollable element
  // itself, the browser moves it together with the links for free whenever
  // the user drags/swipes the nav — no JS has to chase the scroll position
  // frame by frame, which is what caused the visible trembling before.
  // This effect only re-measures the pill (size/left) when the active link's
  // real layout metrics can change independently of navigation: after custom
  // fonts finish loading (FOUT) or on resize.
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

  // On every category change (click or scroll-driven), resize/reposition the
  // pill onto the new active link instantly — no eased/animated slide across
  // the categories in between. An animated nav.scrollLeft made the pill look
  // like it was "traveling" through every button on its way to the clicked
  // one; jumping straight there reads as immediate and correct instead. This
  // is fully independent of the free vertical page-scroll behavior, which
  // still drives activeSection via the section-detector effect below and
  // relies on native nav scrolling (no JS) to keep the pill glued to its link.
  useLayoutEffect(() => {
    const nav = navRef.current
    const activeLink = linkRefs.current[activeSection]
    if (!nav || !activeLink) return

    setPillRect({ width: activeLink.offsetWidth, height: activeLink.offsetHeight, left: activeLink.offsetLeft })

    if (navAnimationFrame.current !== null) {
      cancelAnimationFrame(navAnimationFrame.current)
      navAnimationFrame.current = null
    }

    const navRect = nav.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()
    const navCenter = navRect.left + navRect.width / 2
    const linkCenter = linkRect.left + linkRect.width / 2
    const distance = linkCenter - navCenter

    // Snap the nav scroll instantly to the target category — no glide
    // through the buttons in between, matching the pill's instant repaint
    // above. This is fully independent of the vertical page scroll below,
    // which stays smooth.
    const target = Math.max(0, Math.min(nav.scrollLeft + distance, nav.scrollWidth - nav.clientWidth))
    nav.scrollTo({ left: target, behavior: 'auto' })
  }, [activeSection])

  const filtered = useMemo(() => menu.map(section => ({ ...section, items: section.items.filter(([name, description]) => `${name} ${description}`.toLowerCase().includes(query.toLowerCase())) })).filter(section => section.items.length), [query])

  const handleCategoryClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault()
    const target = document.getElementById(sectionId)
    if (!target) return

    // Paint the pill onto the clicked category immediately instead of
    // waiting for the page-scroll section detector to catch up once the
    // smooth scroll finishes — that lag is what made clicking feel broken.
    setActiveSection(sectionId)

    const stickyHeight = stickyRef.current?.getBoundingClientRect().height ?? 0
    const targetTop = target.getBoundingClientRect().top + window.scrollY - stickyHeight - sectionOffset
    window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="hero-pattern border-b border-border">
<div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-6 pt-4 text-center sm:pb-8 sm:pt-6">
  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolacomanda-VNpRbPJh01Eae6IUkvUaEkNgdUZQTm.webp" alt="La Comanda" className="h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52" />
  </div>
      </header>

      <div ref={stickyRef} className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl">
          <nav ref={navRef} className="scrollbar-hide relative flex gap-2 overflow-x-auto px-5 py-3" style={{ willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }} aria-label="Categorías del menú">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-0 my-auto rounded-full bg-primary shadow-md shadow-primary/20 transition-[width,height] duration-200 ease-out"
              style={{ width: pillRect.width, height: pillRect.height, left: pillRect.left }}
            />
            {sections.map(({ id, label, icon: Icon }) => <a key={id} ref={(el) => { linkRefs.current[id] = el }} data-category={id} href={`#${id}`} onClick={(event) => handleCategoryClick(event, id)} aria-current={activeSection === id ? 'true' : undefined} className={`relative z-10 flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors duration-200 ease-out ${activeSection === id ? 'border-transparent bg-transparent text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}><Icon className="h-3.5 w-3.5" />{label}</a>)}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:pt-12">
        <div className="relative mx-auto mb-12 max-w-xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué tenés ganas de comer?" className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" aria-label="Buscar platos" /></div>
        <div className="space-y-14">
          {filtered.map(section => <section key={section.id} id={section.id} className="scroll-mt-24"><div className="mb-6 flex items-end justify-between border-b border-border pb-4"><div><p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-primary">{section.eyebrow}</p><h2 className="font-serif text-3xl uppercase tracking-wide text-foreground sm:text-4xl">{section.title}</h2></div></div><div className="grid gap-x-10 sm:grid-cols-2">{section.items.map(([name, description], itemIndex) => <article key={name} className="group flex items-start justify-between gap-4 border-b border-border/70 py-5"><div><h3 className="font-serif text-base uppercase tracking-wide text-foreground group-hover:text-primary">{name}</h3><p className="mt-1.5 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p></div><span className="shrink-0 pt-1 font-serif text-sm font-bold uppercase tracking-wide text-primary" aria-label={`Precio ${formatPrice(section.id, itemIndex)}`}>{formatPrice(section.id, itemIndex)}</span></article>)}</div></section>)}
        </div>
        {filtered.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">No encontramos ese plato. Probá con otra palabra.</p>}
      </div>
      <footer className="border-t border-border bg-card px-5 py-6 text-center"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/n-lVCemyWt8jQsqth5SSB8kXA3IgLsyn.png" alt="Carta La Comanda Tejeda" className="mx-auto h-36 w-36 object-contain" /></footer>
    </main>
  )
}

