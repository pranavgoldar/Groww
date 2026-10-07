import { ArrowRight, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/layout/Brand'
import { StockAvatar, StockRow } from '../components/stock/StockRow'
import { ChangeText } from '../components/ui/Change'
import { DemoBadge } from '../components/ui/DemoBadge'
import { LensMark } from '../components/ui/LensMark'
import { Sparkline } from '../components/ui/Sparkline'
import { INDICES } from '../data/indices'
import { DEMO_DAY, FEATURED_STOCK_IDS, MARKET_STORIES, MARKET_SUMMARY } from '../data/market'
import { getStock } from '../data/stocks'
import type { Stock } from '../data/types'
import { inr, num } from '../lib/format'
import { seriesFor } from '../lib/series'
import { usePortfolio } from '../hooks/usePortfolio'
import { useApp } from '../state/AppState'

function greeting(): string {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

/** SCREEN 2 — Home: what's happening today, and which moves are worth understanding. */
export function HomePage() {
  const { watchlist, showTips, prefs } = useApp()
  const featured = FEATURED_STOCK_IDS.map((id) => getStock(id)).filter((s): s is Stock => !!s)
  const watched = watchlist.map((id) => getStock(id)).filter((s): s is Stock => !!s)

  return (
    <main className="mx-auto max-w-6xl lg:px-6 lg:py-8">
      {/* Mobile header */}
      <div className="flex items-center justify-between px-4 pt-4 lg:hidden">
        <Brand />
        <Link to="/explore" className="rounded-full p-2 text-ink hover:bg-subtle" aria-label="Search stocks">
          <Search className="size-5" />
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-8">
        <div className="min-w-0">
          <header className="px-4 pt-5 lg:px-0 lg:pt-0">
            <p className="text-sm text-ink-3">{greeting()}</p>
            <h1 className="mt-1 text-[24px] font-semibold leading-tight tracking-tight lg:text-[28px]">Here’s what’s happening today.</h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-3">
              <span>Demo market day · {DEMO_DAY.label}</span>
              <DemoBadge />
            </div>
          </header>

          {/* Market overview */}
          <section aria-label="Market overview" className="mt-5 grid grid-cols-2 gap-3 px-4 lg:px-0">
            {INDICES.map((idx) => (
              <Link key={idx.id} to={`/index/${idx.id}`} className="rounded-2xl border border-line bg-white p-3.5 transition-colors hover:border-line-strong">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-2">{idx.name}</span>
                  <ChangeText value={idx.dailyChange} className="text-sm" />
                </div>
                <div className="tnum mt-1 text-lg font-semibold">{num(idx.value)}</div>
                <Sparkline values={seriesFor(idx, '1D').map((p) => p.value)} className="mt-2 h-8 w-full" />
              </Link>
            ))}
          </section>

          {/* What's happening */}
          <section className="mt-7 px-4 lg:px-0" aria-labelledby="happening">
            <h2 id="happening" className="text-base font-semibold">
              What’s happening today?
            </h2>
            <p className="mt-1 text-[15px] text-ink-2">{MARKET_SUMMARY}</p>
            <ul className="mt-3 divide-y divide-line rounded-2xl border border-line bg-white">
              {MARKET_STORIES.map((s) => (
                <li key={s.id}>
                  <Link to={s.to} className="flex items-center gap-3 px-4 py-3.5 hover:bg-subtle/60">
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-medium">{s.title}</div>
                      <div className="tnum mt-0.5 text-sm text-ink-3">{s.detail}</div>
                    </div>
                    <span className="shrink-0 text-sm font-medium text-lens-ink">{s.linkLabel}</span>
                    <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Stocks worth understanding */}
          <section className="mt-7" aria-labelledby="worth">
            <div className="px-4 lg:px-0">
              <h2 id="worth" className="text-base font-semibold">
                Stocks worth understanding
              </h2>
              <p className="mt-1 text-sm text-ink-3">Notable moves today. Open Lens to see what’s behind them.</p>
            </div>
            <ul className="mt-3 grid gap-3 px-4 sm:grid-cols-3 lg:px-0">
              {featured.map((s) => (
                <FeaturedCard key={s.id} stock={s} />
              ))}
            </ul>
          </section>

          {showTips && prefs.familiarity === 'new' && (
            <aside className="mx-4 mt-6 flex gap-3 rounded-2xl bg-lens-soft p-4 lg:mx-0">
              <LensMark className="mt-0.5 size-5 shrink-0 text-lens" />
              <p className="text-sm leading-relaxed text-ink-2">
                <span className="font-semibold text-ink">New to this?</span> Every Lens explanation separates facts from
                interpretation, and underlined words have plain-language definitions — just tap them.
              </p>
            </aside>
          )}
        </div>

        {/* Right column (desktop) / continued list (mobile) */}
        <div className="mt-7 space-y-6 lg:mt-0">
          <PortfolioSnapshot />
          <section aria-labelledby="watchlist">
            <div className="flex items-center justify-between px-4 lg:px-0">
              <h2 id="watchlist" className="text-base font-semibold">
                Your watchlist
              </h2>
              <Link to="/explore" className="text-sm font-medium text-lens-ink">
                Explore all
              </Link>
            </div>
            {watched.length ? (
              <ul className="mt-2 divide-y divide-line border-y border-line bg-white lg:rounded-2xl lg:border">
                {watched.map((s) => (
                  <li key={s.id}>
                    <StockRow stock={s} showSpark={false} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 px-4 text-sm text-ink-3 lg:px-0">Tap the bookmark on any stock to add it here.</p>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

function FeaturedCard({ stock }: { stock: Stock }) {
  return (
    <li className="relative flex flex-col rounded-2xl border border-line bg-white p-4 transition-colors hover:border-line-strong">
      <div className="flex items-start gap-3">
        <StockAvatar stock={stock} size="sm" />
        <div className="min-w-0 flex-1">
          <Link to={`/stock/${stock.id}`} className="block truncate text-[15px] font-semibold after:absolute after:inset-0 after:rounded-2xl">
            {stock.name}
          </Link>
          <div className="tnum mt-0.5 text-sm">
            {inr(stock.price)} <ChangeText value={stock.dailyChange} className="ml-1" />
          </div>
        </div>
      </div>
      <Sparkline values={seriesFor(stock, '1D').map((p) => p.value)} className="mt-3 h-10 w-full" />
      <Link
        to={`/stock/${stock.id}/lens`}
        className="relative z-[1] mt-3 flex items-center justify-between gap-2 rounded-xl bg-lens-soft px-3 py-2.5 text-sm font-semibold text-lens-ink transition-colors hover:bg-lens/15"
      >
        <span className="flex items-center gap-1.5">
          <LensMark className="size-3.5" />
          {stock.lensPrompt}
        </span>
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </li>
  )
}

function PortfolioSnapshot() {
  const p = usePortfolio()
  return (
    <section aria-labelledby="snapshot" className="mx-4 lg:mx-0">
      <Link to="/portfolio" className="block rounded-2xl border border-line bg-white p-4 hover:border-line-strong">
        <div className="flex items-center justify-between">
          <h2 id="snapshot" className="text-sm font-semibold text-ink-2">
            Your portfolio
          </h2>
          <ChevronRight className="size-4 text-ink-3" aria-hidden="true" />
        </div>
        <div className="tnum mt-1 text-xl font-semibold">{inr(p.current, 0)}</div>
        <div className="mt-1 flex gap-4 text-sm">
          <span>
            <span className="text-ink-3">Today </span>
            <ChangeText value={p.dayPct} />
          </span>
          <span>
            <span className="text-ink-3">Overall </span>
            <ChangeText value={p.totalPct} />
          </span>
        </div>
      </Link>
    </section>
  )
}
