const MINUS = '−'

/** ₹1,842.00 — Indian digit grouping. */
export function inr(value: number, decimals = 2): string {
  const sign = value < 0 ? MINUS : ''
  return `${sign}₹${Math.abs(value).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`
}

/** 25,184.30 — for index levels. */
export function num(value: number, decimals = 2): string {
  return value.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

/** +2.4% / −1.7% / 0.0% */
export function pct(value: number, decimals = 1): string {
  const rounded = Number(value.toFixed(decimals))
  const sign = rounded > 0 ? '+' : rounded < 0 ? MINUS : ''
  return `${sign}${Math.abs(rounded).toFixed(decimals)}%`
}

/** +₹43.17 / −₹12.01 */
export function signedInr(value: number, decimals = 2): string {
  const rounded = Number(value.toFixed(decimals))
  const sign = rounded > 0 ? '+' : rounded < 0 ? MINUS : ''
  return `${sign}${inr(Math.abs(rounded), decimals)}`
}

/** Absolute price change implied by a percent change from the previous close. */
export function changeFromPct(price: number, changePct: number): number {
  return price - price / (1 + changePct / 100)
}

export function previousClose(price: number, changePct: number): number {
  return price / (1 + changePct / 100)
}

export type Direction = 'up' | 'down' | 'flat'

export function direction(value: number, flatBelow = 0.05): Direction {
  if (Math.abs(value) < flatBelow) return 'flat'
  return value > 0 ? 'up' : 'down'
}

export function upDown(value: number): string {
  return value >= 0 ? 'up' : 'down'
}

export function roseFell(value: number): string {
  return value >= 0 ? 'rose' : 'fell'
}

export function abs1(value: number): string {
  return `${Math.abs(value).toFixed(1)}%`
}
