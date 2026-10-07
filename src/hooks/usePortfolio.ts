import { HOLDINGS } from '../data/portfolio'
import { getStock } from '../data/stocks'
import type { Stock } from '../data/types'
import { changeFromPct } from '../lib/format'

export interface HoldingView {
  stock: Stock
  quantity: number
  avgPrice: number
  invested: number
  current: number
  pnl: number
  pnlPct: number
  dayChange: number
}

export function usePortfolio() {
  const holdings: HoldingView[] = HOLDINGS.flatMap((h) => {
    const stock = getStock(h.stockId)
    if (!stock) return []
    const invested = h.quantity * h.avgPrice
    const current = h.quantity * stock.price
    return [
      {
        stock,
        quantity: h.quantity,
        avgPrice: h.avgPrice,
        invested,
        current,
        pnl: current - invested,
        pnlPct: ((current - invested) / invested) * 100,
        dayChange: h.quantity * changeFromPct(stock.price, stock.dailyChange),
      },
    ]
  })
  const invested = holdings.reduce((a, h) => a + h.invested, 0)
  const current = holdings.reduce((a, h) => a + h.current, 0)
  const day = holdings.reduce((a, h) => a + h.dayChange, 0)
  const biggestMover = [...holdings].sort((a, b) => Math.abs(b.stock.dailyChange) - Math.abs(a.stock.dailyChange))[0]
  return {
    holdings,
    invested,
    current,
    total: current - invested,
    totalPct: ((current - invested) / invested) * 100,
    day,
    dayPct: (day / (current - day)) * 100,
    biggestMover,
  }
}
