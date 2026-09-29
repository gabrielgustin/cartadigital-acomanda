'use client'

import { useEffect, useMemo, useState } from 'react'
import { Search, Utensils, Wine, Beer, Salad, Pizza, Sandwich, Baby, ChevronRight } from 'lucide-react'

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

export default function Page() {
  const [query, setQuery] = useState('')
  const [activeSection, setActiveSection] = useState(sections[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-120px 0px -55% 0px', threshold: [0.1, 0.35, 0.6] },
    )
    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  const filtered = useMemo(() => menu.map(section => ({ ...section, items: section.items.filter(([name, description]) => `${name} ${description}`.toLowerCase().includes(query.toLowerCase())) })).filter(section => section.items.length), [query])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="hero-pattern border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-5 pb-10 pt-8 text-center sm:pb-14 sm:pt-12">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolacomanda-VNpRbPJh01Eae6IUkvUaEkNgdUZQTm.webp" alt="La Comanda" className="h-44 w-44 rounded-full object-cover sm:h-52 sm:w-52" />
          <div className="mt-7 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground"><Utensils className="h-4 w-4 text-primary" /> Hecho para disfrutar</div>
        </div>
      </header>

      <div className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <nav className="scrollbar-hide mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-3" aria-label="Categorías del menú">
          {sections.map(({ id, label, icon: Icon }) => <a key={id} href={`#${id}`} aria-current={activeSection === id ? 'true' : undefined} className={`flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors ${activeSection === id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card text-muted-foreground hover:border-primary hover:text-primary'}`}><Icon className="h-3.5 w-3.5" />{label}</a>)}
        </nav>
      </div>

      <div className="mx-auto max-w-6xl px-5 pb-16 pt-8 sm:pt-12">
        <div className="relative mx-auto mb-12 max-w-xl"><Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="¿Qué tenés ganas de comer?" className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20" aria-label="Buscar platos" /></div>
        <div className="space-y-14">
          {filtered.map(section => <section key={section.id} id={section.id} className="scroll-mt-24"><div className="mb-6 flex items-end justify-between border-b border-border pb-4"><div><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-primary">{section.eyebrow}</p><h2 className="font-serif text-3xl font-bold capitalize text-foreground sm:text-4xl">{section.title}</h2></div><ChevronRight className="mb-1 h-5 w-5 text-primary/60" /></div><div className="grid gap-x-10 sm:grid-cols-2">{section.items.map(([name, description]) => <article key={name} className="group flex items-start justify-between gap-4 border-b border-border/70 py-5"><div><h3 className="font-serif text-lg font-bold capitalize text-foreground group-hover:text-primary">{name}</h3><p className="mt-1 max-w-lg text-sm leading-6 text-muted-foreground">{description}</p></div><span className="shrink-0 pt-1 text-sm font-bold text-primary" aria-label="Precio a completar">—</span></article>)}</div></section>)}
        </div>
        {filtered.length === 0 && <p className="py-20 text-center text-sm text-muted-foreground">No encontramos ese plato. Probá con otra palabra.</p>}
      </div>
      <footer className="border-t border-border bg-card px-5 py-10 text-center"><img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logolacomanda-VNpRbPJh01Eae6IUkvUaEkNgdUZQTm.webp" alt="La Comanda" className="mx-auto h-24 w-24 rounded-full object-cover" /><p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Lo bueno se comparte</p></footer>
    </main>
  )
}

