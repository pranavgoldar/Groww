// Indian rupee formatting, done by hand (last 3 digits, then pairs): ₹1,20,000.

export function groupIN(n: number): string {
  const s = String(Math.round(Math.abs(n)))
  if (s.length <= 3) return s
  const last3 = s.slice(-3)
  const rest = s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',')
  return `${rest},${last3}`
}

/** ₹40,000 · −₹900 (true minus sign for negatives) */
export function inr(n: number): string {
  return (n < 0 ? '−' : '') + '₹' + groupIN(n)
}

/** ₹7,000–8,000 */
export function inrRange(a: number, b: number): string {
  return a === b ? inr(a) : `${inr(a)}–${groupIN(b)}`
}

export const r100 = (n: number) => Math.round(n / 100) * 100
export const r50 = (n: number) => Math.round(n / 50) * 50

/** Digits typed into an amount field, capped at 8 digits. */
export function parseAmount(text: string): number {
  const digits = text.replace(/\D/g, '').replace(/^0+/, '').slice(0, 8)
  return digits ? parseInt(digits, 10) : 0
}

/** 0.72 → "0.7" */
export function oneDecimal(n: number): string {
  return (Math.round(n * 10) / 10).toFixed(1)
}
