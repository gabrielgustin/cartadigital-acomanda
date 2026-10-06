export const formatPrice = (amount: number) => `$${amount.toLocaleString('es-AR')}`

// Minúsculas y sin tildes, para que "cafe" encuentre "café" y "pina" encuentre "piña".
export const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
