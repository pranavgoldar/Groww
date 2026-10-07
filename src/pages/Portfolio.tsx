import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { StockAvatar } from '../components/stock/StockRow'
import { ChangeText } from '../components/ui/Change'
import { DemoBadge } from '../components/ui/DemoBadge'
import { LensMark } from '../components/ui/LensMark'
import { usePortfolio } from '../hooks/usePortfolio'
import { inr, signedInr } from '../lib/format'
import { lensQuestion } from '../lib/lensCopy'

/** SCREEN 7 — A simple portfolio, so Lens sits inside a coherent investing product. */
export function PortfolioPage() {
  const p = usePortfolio()
  const mover = p.biggestMover
  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 pt-5 lg:px-6 lg:py-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-[24px] font-semibold tracking-tight">Portfolio</h1>
        <DemoBadge />
      </div>

      <section aria-label="Summary" className="mt-4 rounded-2xl border border-line bg-white p-5">
        <div className="text-sm text-ink-3">Current value</div>
        <div className="tnum mt-1 text-[30px] font-semibold leading-tight tracking-tight">{inr(p.current)}</div>
        <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-line pt-4 text-sm">
          <div>
            <dt className="text-ink-3">Invested</dt>
            <dd className="tnum mt-1 font-medium">{inr(p.invested, 0)}</dd>
          </div>
          <div>
            <dt className="text-ink-3">Total returns</dt>
            <dd className="tnum mt-1 font-medium">
              <span className={p.total >= 0 ? 'text-gain' : 'text-loss'}>{signedInr(p.total, 0)}</span>
              <ChangeText value={p.totalPct} className="ml-1 block text-xs sm:inline" />
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">Today</dt>
            <dd className="tnum mt-1 font-medium">
              <span className={p.day >= 0 ? 'text-gain' : 'text-loss'}>{signedInr(p.day, 0)}</span>
              <ChangeText value={p.dayPct} className="ml-1 block text-xs sm:inline" />
            </dd>
          </div>
        </dl>
      </section>

      {mover && (
        <Link
          to={`/stock/${mover.stock.id}/lens`}
          className="mt-3 flex items-center gap-3 rounded-2xl bg-lens-soft px-4 py-3.5 transition-colors hover:bg-lens/15"
        >
          <LensMark className="size-5 shrink-0 text-lens" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-lens-ink">Biggest move in your holdings today</div>
            <div className="mt-0.5 text-[15px] font-semibold text-ink">{lensQuestion(mover.stock)}</div>
          </div>
          <ArrowRight className="size-4 shrink-0 text-lens-ink" aria-hidden="true" />
        </Link>
      )}

      <section className="mt-6" aria-labelledby="holdings">
        <h2 id="holdings" className="text-base font-semibold">
          Holdings <span className="font-normal text-ink-3">({p.holdings.length})</span>
        </h2>
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
          {p.holdings.map((h) => (
            <li key={h.stock.id}>
              <Link to={`/stock/${h.stock.id}`} className="flex items-center gap-3 px-4 py-3.5 hover:bg-subtle/60">
                <StockAvatar stock={h.stock} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[15px] font-medium">{h.stock.name}</div>
                  <div className="tnum mt-0.5 text-xs text-ink-3">
                    {h.quantity} shares · Avg {inr(h.avgPrice)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="tnum text-[15px] font-medium">{inr(h.current, 0)}</div>
                  <div className="tnum mt-0.5 text-xs">
                    <span className={h.pnl >= 0 ? 'text-gain' : 'text-loss'}>{signedInr(h.pnl, 0)}</span>{' '}
                    <span className="text-ink-3">·</span> <ChangeText value={h.stock.dailyChange} suffix="today" />
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-ink-3">Illustrative holdings for this prototype. Not linked to any real account.</p>
      </section>
    </main>
  )
}
