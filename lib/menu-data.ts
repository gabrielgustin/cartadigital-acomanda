export type Lang = 'es' | 'en'
export type Localized = Record<Lang, string>

export interface MenuItem {
  id: string
  sectionId: string
  name: Localized
  description: Localized
  price: number
  /** Imagen propia del plato; si falta se usa la de su categoría. */
  image?: string
  /** Un plato oculto no aparece en la carta pública. */
  visible: boolean
}

export interface MenuSection {
  id: string
  label: Localized
  title: Localized
  eyebrow: Localized
  image: string
  /** Clave de `lib/category-icons.ts`. */
  icon: string
  /** Una categoría oculta no aparece en la carta pública. */
  visible: boolean
  items: MenuItem[]
}

// [nombre es, nombre en, descripción es, descripción en]
type RawItem = [string, string, string, string]

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

// Precios de relleno: se calculan por categoría y posición hasta cargar los
// precios reales. Cuando estén, reemplazar por un precio explícito en cada plato.
const placeholderBase: Record<string, number> = {
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

const placeholderPrice = (sectionId: string, index: number) => {
  const step = sectionId === 'pizzas' ? 650 : sectionId === 'bebidas' ? 450 : 550
  return (placeholderBase[sectionId] ?? 5000) + index * step
}

const seedIcons: Record<string, string> = {
  sandwiches: 'sandwich',
  burgers: 'utensils',
  pizzas: 'pizza',
  entradas: 'salad',
  principales: 'utensils',
  mexicana: 'utensils',
  bebidas: 'wine',
  cervezas: 'beer',
  infantil: 'baby',
}

const section = (
  id: string,
  label: [string, string],
  title: [string, string],
  eyebrow: [string, string],
  raw: RawItem[],
): MenuSection => ({
  id,
  label: { es: label[0], en: label[1] },
  title: { es: title[0], en: title[1] },
  eyebrow: { es: eyebrow[0], en: eyebrow[1] },
  image: `/menu/${id}.png`,
  icon: seedIcons[id] ?? 'utensils',
  visible: true,
  items: raw.map(([nameEs, nameEn, descEs, descEn], index) => ({
    id: `${id}-${slugify(nameEs)}`,
    sectionId: id,
    name: { es: nameEs, en: nameEn },
    description: { es: descEs, en: descEn },
    price: placeholderPrice(id, index),
    visible: true,
  })),
})

/** Carta inicial: se usa hasta que el backoffice guarda cambios por primera vez. */
export const seedMenu: MenuSection[] = [
  section('sandwiches', ['Sandwiches', 'Sandwiches'], ['Sandwiches especiales', 'Special sandwiches'], ['Lo bueno se comparte', 'Good things are meant to be shared'], [
    ['Entraña', 'Skirt steak', 'Mayonesa casera, entraña braseada, rúcula, champiñones, tomate confitado y papas fritas', 'Homemade mayo, braised skirt steak, arugula, mushrooms, confit tomato and french fries'],
    ['Molleja', 'Sweetbreads', 'Mayonesa casera, mollejitas grilladas al limón, queso Chubut, lechuga, tomate y papas fritas', 'Homemade mayo, lemon-grilled sweetbreads, Chubut cheese, lettuce, tomato and french fries'],
    ['Bife de chorizo', 'Sirloin steak', 'Mayonesa casera, bife de chorizo a la plancha, queso Chubut, huevo, lechuga, tomate y papas fritas', 'Homemade mayo, griddled sirloin steak, Chubut cheese, egg, lettuce, tomato and french fries'],
    ['Bondiola de cerdo', 'Pork shoulder', 'Bondiola braseada, coleslaw, pepinillos caseros, cebollas crispy, mostanesa y barbacoa casera', 'Braised pork shoulder, coleslaw, homemade pickles, crispy onions, mostanesa (mustard mayo) and homemade BBQ sauce'],
    ['Vacío braseado', 'Braised flank steak', 'Vacío braseado, salsa balsámica, mayonesa casera, queso Chubut, lechuga, tomate, huevo y papas fritas', 'Braised flank steak, balsamic sauce, homemade mayo, Chubut cheese, lettuce, tomato, egg and french fries'],
    ['Vegetariano', 'Vegetarian', 'Berenjena, cebolla, pimiento, huevo, queso, champiñón, lechuga y tomate', 'Eggplant, onion, bell pepper, egg, cheese, mushroom, lettuce and tomato'],
  ]),
  section('burgers', ['Burgers', 'Burgers'], ['Burgers', 'Burgers'], ['Hechas para ensuciarse las manos', 'Made to get your hands dirty'], [
    ['Clásica', 'Classic', '200 gr. de carne, mayonesa casera, huevo, queso, lechuga, tomate, pan brioche y papas fritas', '200 g beef patty, homemade mayo, egg, cheese, lettuce, tomato, brioche bun and french fries'],
    ['Bacon', 'Bacon', '200 gr. de carne, panceta, cebollita caramelizada, cheddar, lechuga, tomate, pan brioche y papas fritas', '200 g beef patty, bacon, caramelized onion, cheddar, lettuce, tomato, brioche bun and french fries'],
    ['Blue cheese', 'Blue cheese', '200 gr. de carne, mayonesa casera, rúcula, queso azul, huevo, cebolla y papas fritas', '200 g beef patty, homemade mayo, arugula, blue cheese, egg, onion and french fries'],
    ['De costillas', 'Short rib', 'Medallón de costilla 200 gr., cheddar x2, panceta, cebolla crispy, pepinillos y papas fritas', '200 g short rib patty, double cheddar, bacon, crispy onion, pickles and french fries'],
    ['Lomos 150 gr.', 'Tenderloin sandwich 150 g', 'Pan pita, bife de lomo, lechuga, tomate, queso, huevo, mayonesa casera y papas fritas', 'Pita bread, beef tenderloin steak, lettuce, tomato, cheese, egg, homemade mayo and french fries'],
  ]),
  section('pizzas', ['Pizzas', 'Pizzas'], ['Pizzas', 'Pizzas'], ['La mejor idea fue invitarte', 'The best idea was inviting you'], [
    ['Mozzarella', 'Mozzarella', 'Salsa de tomate, mozzarella y orégano', 'Tomato sauce, mozzarella and oregano'],
    ['Napolitana', 'Neapolitan', 'Salsa de tomate, mozzarella y tomate en rodajas', 'Tomato sauce, mozzarella and sliced tomato'],
    ['Napo con jamón', 'Neapolitan with ham', 'Salsa de tomate, mozzarella, tomate en rodajas, jamón y oliva saborizada', 'Tomato sauce, mozzarella, sliced tomato, ham and flavored olive oil'],
    ['Rúcula', 'Arugula', 'Salsa de tomate, mozzarella, jamón crudo, rúcula y parmesano', 'Tomato sauce, mozzarella, cured ham, arugula and parmesan'],
    ['Palmitos', 'Hearts of palm', 'Salsa de tomate, mozzarella, jamón cocido, palmitos y salsa golf', 'Tomato sauce, mozzarella, cooked ham, hearts of palm and golf sauce'],
    ['La Comanda', 'La Comanda', 'Salsa de tomate, mozzarella, verdeo, panceta, pollo y champiñones', 'Tomato sauce, mozzarella, scallion, bacon, chicken and mushrooms'],
    ['Del bosque', 'Forest', 'Salsa de tomate, mozzarella, rúcula, pera, roquefort y nuez', 'Tomato sauce, mozzarella, arugula, pear, roquefort and walnut'],
    ['Cuatro quesos', 'Four cheese', 'Salsa de tomate, mozzarella, provolone, sardo y roquefort', 'Tomato sauce, mozzarella, provolone, sardo and roquefort'],
    ['Provenzal', 'Provençal', 'Salsa de tomate, mozzarella, ajo y perejil', 'Tomato sauce, mozzarella, garlic and parsley'],
    ['Fugazzetta', 'Fugazzetta', 'Salsa de tomate, mozzarella y cebolla dorada', 'Tomato sauce, mozzarella and golden onion'],
    ['Calabresa', 'Calabrese', 'Salsa de tomate, mozzarella y salame', 'Tomato sauce, mozzarella and salami'],
    ['Carbonara', 'Carbonara', 'Salsa de tomate, mozzarella, panceta, huevo y parmesano', 'Tomato sauce, mozzarella, bacon, egg and parmesan'],
  ]),
  section('entradas', ['Entradas', 'Starters'], ['Entradas', 'Starters'], ['Para arrancar', 'To get started'], [
    ['Papas fritas', 'French fries', 'Papas fritas bastón', 'Thick-cut french fries'],
    ['Papas con huevo', 'Fries with eggs', 'Papas fritas bastón y huevos revueltos', 'Thick-cut french fries and scrambled eggs'],
    ['Papas jodidas', 'Loaded fries', 'Papas fritas, cheddar, huevo, panceta, verdeo y chile opcional', 'Fries, cheddar, egg, bacon, scallion and optional chili'],
    ['Provoleta con chutney', 'Provoleta with chutney', 'Provoleta, chutney de tomate y almendras', 'Grilled provolone, tomato chutney and almonds'],
    ['Provoleta con verdeo', 'Provoleta with scallion', 'Provoleta, verdeo y pimentón', 'Grilled provolone, scallion and paprika'],
    ['Pinchos de langostinos', 'Prawn skewers', 'Langostino empanizado, salsa provenzal y papas fritas', 'Breaded prawns, provençal sauce and french fries'],
  ]),
  section('principales', ['Principales', 'Mains'], ['Platos principales', 'Main dishes'], ['El centro de la mesa', 'The centerpiece of the table'], [
    ['Bife de chorizo criollo', 'Creole sirloin steak', 'Bife de chorizo de 400 gr., salsa criolla, huevo frito y papas rústicas', '400 g sirloin steak, salsa criolla, fried egg and rustic fries'],
    ['Bife con champiñones', 'Sirloin steak with mushrooms', 'Bife de chorizo de 400 gr., salsa de champiñones, crema y papas rústicas', '400 g sirloin steak, mushroom sauce, cream and rustic fries'],
  ]),
  section('mexicana', ['Mexicana', 'Mexican'], ['Comida mexicana', 'Mexican food'], ['Armala como más te guste', 'Build it your way'], [
    ['Fajitas', 'Fajitas', 'Carne a elección: ternera, pollo o cerdo, cebolla, pimientos, seis tortillas y seis salsas', 'Choice of meat: beef, chicken or pork, onion, bell peppers, six tortillas and six sauces'],
    ['Quesadilla de champiñones', 'Mushroom quesadilla', 'Dos tortillas de trigo, pollo, muzarella, champiñones y dos salsas', 'Two wheat tortillas, chicken, mozzarella, mushrooms and two sauces'],
    ['Quesadilla jamón y muzarella', 'Ham and mozzarella quesadilla', 'Dos tortillas de trigo, pollo, jamón, muzarella y dos salsas', 'Two wheat tortillas, chicken, ham, mozzarella and two sauces'],
  ]),
  section('bebidas', ['Bebidas', 'Drinks'], ['Tragos & bebidas', 'Drinks & cocktails'], ['Para brindar', "Let's toast"], [
    ['Mojito', 'Mojito', 'Lima, menta, azúcar, ron blanco y Sprite', 'Lime, mint, sugar, white rum and Sprite'],
    ['Fernet branca con coca', 'Fernet Branca and Coke', 'Fernet Branca y Coca Cola', 'Fernet Branca and Coca-Cola'],
    ['Campari con naranja', 'Campari and orange', 'Campari, jugo de naranja y rodaja de naranja', 'Campari, orange juice and orange slice'],
    ['Gin tonic', 'Gin tonic', 'Gin Mediterráneo, almíbar de romero, agua tónica y frutos rojos', 'Mediterráneo gin, rosemary syrup, tonic water and red berries'],
    ['Caipiriña', 'Caipirinha', 'Lima, azúcar y cachaça', 'Lime, sugar and cachaça'],
    ['Whisky sour', 'Whisky sour', 'Whisky, clara de huevo, almíbar y jugo de limón', 'Whisky, egg white, syrup and lemon juice'],
    ['Negroni', 'Negroni', 'Gin, Campari, vermouth y naranja', 'Gin, Campari, vermouth and orange'],
    ['Vinos', 'Wines', 'Nicasia, Estiba y Álamos. Consultar variedades disponibles.', 'Nicasia, Estiba and Álamos. Ask about available varieties.'],
  ]),
  section('cervezas', ['Cervezas', 'Beers'], ['Cervezas', 'Beers'], ['Bien frías', 'Ice cold'], [
    ['Heineken 1 lt.', 'Heineken 1 L', 'Botella', 'Bottle'],
    ['Sol 1 lt.', 'Sol 1 L', 'Botella', 'Bottle'],
    ['Miller 1 lt.', 'Miller 1 L', 'Botella', 'Bottle'],
    ['Imperial IPA 1 lt.', 'Imperial IPA 1 L', 'Botella', 'Bottle'],
    ['Imperial Amber Lager 1 lt.', 'Imperial Amber Lager 1 L', 'Botella', 'Bottle'],
    ['Imperial Stout 1 lt.', 'Imperial Stout 1 L', 'Negra', 'Dark beer'],
    ['Chopp pinta', 'Draft pint', 'Imperial Lager 530 cc', 'Imperial Lager 530 cc'],
    ['Chopp 1/2 pinta', 'Draft half pint', 'Imperial Lager 330 cc', 'Imperial Lager 330 cc'],
  ]),
  section('infantil', ['Infantil', 'Kids'], ['Menú infantil', "Kids' menu"], ['Para los más chicos', 'For the little ones'], [
    ['Hamburguesa con papas', 'Burger with fries', 'Hamburguesa de carne, queso, lechuga y tomate opcional, papas fritas', 'Beef burger, cheese, lettuce and optional tomato, french fries'],
    ['Milanesita de ternera', 'Veal milanesa', 'Milanesita de ternera y papas fritas', 'Small breaded veal cutlet and french fries'],
  ]),
]
