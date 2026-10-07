import type { ChartRange } from '../data/types'

export interface SeriesPoint {
  value: number
  label: string
}

/** Small deterministic PRNG so demo charts look the same on every load. */
function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

const POINTS: Record<ChartRange, number> = { '1D': 76, '1W': 41, '1M': 64, '1Y': 104 }
const NOISE: Record<ChartRange, number> = { '1D': 0.0009, '1W': 0.0016, '1M': 0.0028, '1Y': 0.006 }

/**
 * Builds an illustrative price path that passes exactly through the given anchors,
 * with bridge noise between them (zero at every anchor).
 */
export function buildSeries(anchors: number[], range: ChartRange, seedKey: string): number[] {
  const n = POINTS[range]
  const rand = mulberry32(hash(`${seedKey}:${range}`))
  const segments = anchors.length - 1
  const out: number[] = []
  for (let seg = 0; seg < segments; seg++) {
    const start = Math.round((seg * (n - 1)) / segments)
    const end = Math.round(((seg + 1) * (n - 1)) / segments)
    const steps = end - start
    const a = anchors[seg]
    const b = anchors[seg + 1]
    const walk = [0]
    for (let j = 1; j <= steps; j++) walk.push(walk[j - 1] + (rand() - 0.5))
    const last = walk[steps]
    for (let j = seg === 0 ? 0 : 1; j <= steps; j++) {
      const t = j / steps
      const bridge = walk[j] - t * last
      out.push(a + (b - a) * t + bridge * NOISE[range] * a * 2)
    }
  }
  return out
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Trading days ending on the demo day (Wed 7 Oct 2026), skipping weekends and the Oct 2 holiday. */
function tradingDays(count: number): Date[] {
  const days: Date[] = []
  const d = new Date(2026, 9, 7)
  while (days.length < count) {
    const dow = d.getDay()
    const holiday = d.getMonth() === 9 && d.getDate() === 2
    if (dow !== 0 && dow !== 6 && !holiday) days.unshift(new Date(d))
    d.setDate(d.getDate() - 1)
  }
  return days
}

function dayLabel(d: Date): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`
}

export function seriesLabels(range: ChartRange): string[] {
  const n = POINTS[range]
  if (range === '1D') {
    return Array.from({ length: n }, (_, i) => {
      const mins = 9 * 60 + 15 + i * 5
      const h = Math.floor(mins / 60)
      const m = mins % 60
      const h12 = h > 12 ? h - 12 : h
      return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
    })
  }
  if (range === '1W') {
    const days = tradingDays(5)
    return Array.from({ length: n }, (_, i) => dayLabel(days[Math.min(4, Math.round((i / (n - 1)) * 4))]))
  }
  if (range === '1M') {
    const days = tradingDays(22)
    return Array.from({ length: n }, (_, i) => dayLabel(days[Math.round((i / (n - 1)) * 21)]))
  }
  return Array.from({ length: n }, (_, i) => {
    const weeksAgo = Math.round(((n - 1 - i) / (n - 1)) * 52)
    const d = new Date(2026, 9, 7 - weeksAgo * 7)
    return `${dayLabel(d)} ’${String(d.getFullYear()).slice(2)}`
  })
}

export function getSeries(anchors: Record<ChartRange, number[]>, range: ChartRange, seedKey: string): SeriesPoint[] {
  const values = buildSeries(anchors[range], range, seedKey)
  const labels = seriesLabels(range)
  return values.map((value, i) => ({ value, label: labels[i] ?? '' }))
}

export function rangeStats(values: number[]): { low: number; high: number } {
  return { low: Math.min(...values), high: Math.max(...values) }
}

const cache = new Map<string, SeriesPoint[]>()

/** Memoised series for a stock or index (data never changes at runtime). */
export function seriesFor(item: { id: string; chartAnchors: Record<ChartRange, number[]> }, range: ChartRange): SeriesPoint[] {
  const key = `${item.id}:${range}`
  let s = cache.get(key)
  if (!s) {
    s = getSeries(item.chartAnchors, range, item.id)
    cache.set(key, s)
  }
  return s
}
