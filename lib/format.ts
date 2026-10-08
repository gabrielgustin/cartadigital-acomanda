export const formatPrice = (amount: number) =>
  `$${amount.toLocaleString('es-AR', { minimumFractionDigits: Number.isInteger(amount) ? 0 : 2 })}`

// Minúsculas y sin tildes, para que "cafe" encuentre "café" y "pina" encuentre "piña".
export const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
