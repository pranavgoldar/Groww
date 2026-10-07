import { Bookmark, BookmarkCheck, CircleHelp } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { LensEntryCard } from '../components/stock/LensEntryCard'
import { OrderSheet } from '../components/stock/OrderSheet'
import { RangeBar } from '../components/stock/RangeBar'
import { ChangeText } from '../components/ui/Change'
import { DemoBadge } from '../components/ui/DemoBadge'
import { LensMark } from '../components/ui/LensMark'
import { PriceChart } from '../components/ui/PriceChart'
import { Segmented } from '../components/ui/Segmented'
import { getStock } from '../data/stocks'
import type { ChartRange, Stock } from '../data/types'
import { changeFromPct, inr, previousClose, signedInr } from '../lib/format'
import { rangeStats, seriesFor, type SeriesPoint } from '../lib/series'
import { useApp } from '../state/AppState'
import { useGlossary } from '../state/Glossary'
import { NotFound } from './NotFound'

const RANGE_LABEL: Record<ChartRange, string> = { '1D': 'today', '1W': 'past week', '1M': 'past month', '1Y': 'past year' }

/** SCREEN 3 — Stock detail. The Lens entry card sits right under the price. */
export function StockDetailPage() {
  const { id } = useParams()
  const stock = getStock(id)
  const { watchlist, toggleWatch } = useApp()
  const [range, setRange] = useState<ChartRange>('1D')
  const [scrub, setScrub] = useState<SeriesPoint | null>(null)
  const [order, setOrder] = useState<'buy' | 'sell' | null>(null)

  const series = useMemo(() => (stock ? seriesFor(stock, range) : []), [stock, range])
  if (!stock) return <NotFound />

  const watching = watchlist.includes(stock.id)
  const base = range === '1D' ? previousClose(stock.price, stock.dailyChange) : series[0].value
  const shown = scrub?.value ?? stock.price
  const delta = shown - base
  const deltaPct = (delta / base) * 100
  const today = rangeStats(seriesFor(stock, '1D').map((p) => p.value))
  const year = rangeStats([...seriesFor(stock, '1Y').map((p) => p.value), today.low, today.high])

  return (
    <>
      <TopBar
        back="/"
        title={stock.shortName}
        subtitle={`${stock.ticker} · NSE`}
        right={
          <button
            onClick={() => toggleWatch(stock.id)}
            aria-pressed={watching}
            aria-label={watching ? 'Remove from watchlist' : 'Add to watchlist'}
            className="rounded-full p-2 text-ink hover:bg-subtle"
          >
            {watching ? <BookmarkCheck className="size-5 fill-ink text-ink" /> : <Bookmark className="size-5" />}
          </button>
        }
      />

      <main className="mx-auto max-w-6xl pb-28 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8 lg:px-6 lg:pb-16 lg:pt-6">
        <div className="min-w-0 space-y-2 bg-subtle lg:space-y-4 lg:bg-transparent">
          <section className="bg-white px-4 pb-5 pt-4 sm:px-6 lg:rounded-2xl lg:border lg:border-line lg:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold tracking-tight">{stock.name}</h1>
                <div className="mt-0.5 text-sm text-ink-3">{stock.sector}</div>
              </div>
              <DemoBadge className="hidden sm:inline-flex" />
            </div>
            <div className="mt-4">
              <div className="tnum text-[32px] font-semibold leading-none tracking-tight">{inr(shown)}</div>
              <div className="tnum mt-2 text-sm">
                <ChangeText value={deltaPct} /> <span className={delta >= 0 ? 'text-gain' : 'text-loss'}>({signedInr(delta)})</span>{' '}
                <span className="text-ink-3">{scrub ? scrub.label : RANGE_LABEL[range]}</span>
              </div>
            </div>

            {/* Lens entry — visible without scrolling on mobile */}
            <div className="mt-5 lg:hidden">
              <LensEntryCard stock={stock} />
            </div>

            <div className="mt-6">
              <PriceChart
                series={series}
                baseline={range === '1D' ? base : undefined}
                onScrub={setScrub}
                label={`${stock.name} price chart, ${RANGE_LABEL[range]}: from ${inr(series[0].value)} to ${inr(series[series.length - 1].value)}. Illustrative data.`}
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Segmented<ChartRange>
                label="Chart range"
                value={range}
                onChange={(r) => {
                  setRange(r)
                  setScrub(null)
                }}
                options={(['1D', '1W', '1M', '1Y'] as ChartRange[]).map((r) => ({ value: r, label: r }))}
              />
              <span className="text-xs text-ink-3 sm:hidden">Demo data</span>
            </div>
          </section>

          <section className="bg-white px-4 py-5 sm:px-6 lg:rounded-2xl lg:border lg:border-line lg:p-6">
            <h2 className="text-base font-semibold">Performance</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <RangeBar label="Today’s range" low={today.low} high={today.high} current={stock.price} />
              <RangeBar label="52-week range" low={year.low} high={year.high} current={stock.price} />
            </div>
          </section>

          <KeyStatsSection stock={stock} />

          <section className="bg-white px-4 py-5 sm:px-6 lg:rounded-2xl lg:border lg:border-line lg:p-6">
            <h2 className="text-base font-semibold">About {stock.shortName}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{stock.about}</p>
          </section>
        </div>

        {/* Desktop right column */}
        <aside className="hidden lg:block">
          <div className="sticky top-[8.5rem] space-y-4">
            <LensEntryCard stock={stock} />
            <div className="rounded-2xl border border-line bg-white p-4">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setOrder('sell')} className="rounded-xl border border-line py-2.5 text-sm font-semibold text-loss hover:bg-loss-soft">
                  Sell
                </button>
                <button onClick={() => setOrder('buy')} className="rounded-xl border border-line py-2.5 text-sm font-semibold text-gain hover:bg-gain-soft">
                  Buy
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-ink-3">Orders are disabled in this prototype.</p>
            </div>
          </div>
        </aside>
      </main>

      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-white px-4 pt-3 pb-safe lg:hidden">
        <div className="mx-auto flex max-w-lg gap-2.5 pb-3">
          <Link
            to={`/stock/${stock.id}/lens`}
            className="flex flex-[1.4] items-center justify-center gap-1.5 rounded-xl bg-lens py-3 text-sm font-semibold text-white"
          >
            <LensMark className="size-4" />
            Lens
          </Link>
          <button onClick={() => setOrder('sell')} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-loss">
            Sell
          </button>
          <button onClick={() => setOrder('buy')} className="flex-1 rounded-xl border border-line py-3 text-sm font-semibold text-gain">
            Buy
          </button>
        </div>
      </div>

      <OrderSheet stock={stock} side={order} onClose={() => setOrder(null)} />
    </>
  )
}

function KeyStatsSection({ stock }: { stock: Stock }) {
  const { showTips } = useApp()
  const openTerm = useGlossary()
  const s = stock.stats
  const rows: Array<{ label: string; value: string; term?: string }> = [
    { label: 'Market cap', value: s.marketCap, term: 'market-cap' },
    { label: 'P/E ratio', value: s.pe.toFixed(1), term: 'pe' },
    { label: 'Sector P/E', value: s.sectorPe.toFixed(1), term: 'pe' },
    { label: 'P/B ratio', value: s.pb.toFixed(1), term: 'pb' },
    { label: 'ROE', value: `${s.roe.toFixed(1)}%`, term: 'roe' },
    { label: 'Dividend yield', value: `${s.dividendYield.toFixed(1)}%`, term: 'dividend-yield' },
  ]
  const perShare = changeFromPct(stock.price, stock.dailyChange)
  return (
    <section className="bg-white px-4 py-5 sm:px-6 lg:rounded-2xl lg:border lg:border-line lg:p-6">
      <h2 className="text-base font-semibold">Key figures</h2>
      <dl className="mt-3 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="border-b border-line py-3">
            <dt className="flex items-center gap-1 text-xs text-ink-3">
              {r.label}
              {showTips && r.term && (
                <button onClick={() => openTerm(r.term!)} className="rounded-full text-ink-3 hover:text-ink-2" aria-label={`What is ${r.label}?`}>
                  <CircleHelp className="size-3.5" />
                </button>
              )}
            </dt>
            <dd className="tnum mt-1 text-[15px] font-medium">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-ink-3">
        Illustrative figures for this prototype. Day change: {signedInr(perShare)} per share.
      </p>
    </section>
  )
}
