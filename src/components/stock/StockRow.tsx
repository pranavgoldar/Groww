import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Stock } from '../../data/types'
import { inr } from '../../lib/format'
import { seriesFor } from '../../lib/series'
import { ChangeText } from '../ui/Change'
import { Sparkline } from '../ui/Sparkline'

export function StockAvatar({ stock, size = 'md' }: { stock: Stock; size?: 'sm' | 'md' }) {
  const initials = stock.shortName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl border border-line bg-white font-semibold text-ink-2 ${size === 'sm' ? 'size-8 text-[11px]' : 'size-10 text-xs'}`}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}

export function StockRow({ stock, showSpark = true }: { stock: Stock; showSpark?: boolean }) {
  return (
    <Link to={`/stock/${stock.id}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-subtle/60 lg:px-5">
      <StockAvatar stock={stock} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium">{stock.name}</div>
        <div className="truncate text-xs text-ink-3">
          {stock.ticker} · {stock.sector}
        </div>
      </div>
      {showSpark && <Sparkline values={seriesFor(stock, '1D').map((p) => p.value)} className="hidden h-7 w-16 sm:block" />}
      <div className="text-right">
        <div className="tnum text-[15px] font-medium">{inr(stock.price)}</div>
        <ChangeText value={stock.dailyChange} className="text-xs" />
      </div>
      <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
    </Link>
  )
}
