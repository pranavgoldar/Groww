import { ChevronRight, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StockRow } from '../components/stock/StockRow'
import { ChangeText } from '../components/ui/Change'
import { INDICES } from '../data/indices'
import { STOCK_ALIASES, STOCKS } from '../data/stocks'
import { num } from '../lib/format'

/** Find a stock — the first step of the core journey. */
export function ExplorePage() {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const stocks = useMemo(
    () =>
      STOCKS.filter(
        (s) =>
          !q ||
          s.name.toLowerCase().includes(q) ||
          s.ticker.toLowerCase().includes(q) ||
          s.sector.toLowerCase().includes(q) ||
          STOCK_ALIASES[s.id]?.some((a) => a.includes(q)),
      ),
    [q],
  )
  const indices = INDICES.filter((i) => !q || i.name.toLowerCase().includes(q))

  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 pt-5 lg:px-6 lg:py-8">
      <h1 className="text-[24px] font-semibold tracking-tight">Explore</h1>
      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-3" aria-hidden="true" />
        <label htmlFor="explore-search" className="sr-only">
          Search stocks
        </label>
        <input
          id="explore-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stocks, e.g. HDFC Bank"
          className="w-full rounded-xl border border-line-strong bg-white py-3 pl-10 pr-10 text-[15px] outline-none placeholder:text-ink-3 focus:border-lens focus:ring-2 focus:ring-lens/15 [&::-webkit-search-cancel-button]:hidden"
          autoComplete="off"
        />
        {query && (
          <button onClick={() => setQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-3 hover:bg-subtle" aria-label="Clear search">
            <X className="size-4" />
          </button>
        )}
      </div>

      <section className="mt-6" aria-labelledby="stocks-h">
        <h2 id="stocks-h" className="text-sm font-semibold text-ink-2">
          Stocks
        </h2>
        {stocks.length ? (
          <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {stocks.map((s) => (
              <li key={s.id}>
                <StockRow stock={s} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 rounded-2xl border border-dashed border-line px-4 py-6 text-center text-sm text-ink-3">
            No matches. This prototype covers {STOCKS.length} stocks and {INDICES.length} indices.
          </p>
        )}
      </section>

      {indices.length > 0 && (
        <section className="mt-6" aria-labelledby="indices-h">
          <h2 id="indices-h" className="text-sm font-semibold text-ink-2">
            Indices
          </h2>
          <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {indices.map((i) => (
              <li key={i.id}>
                <Link to={`/index/${i.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-subtle/60 lg:px-5">
                  <div className="min-w-0 flex-1">
                    <div className="text-[15px] font-medium">{i.name}</div>
                    <div className="truncate text-xs text-ink-3">{i.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="tnum text-[15px] font-medium">{num(i.value)}</div>
                    <ChangeText value={i.dailyChange} className="text-xs" />
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <p className="mt-6 text-xs text-ink-3">Demo data · Not real-time. Derivatives, F&amp;O and crypto are out of scope.</p>
    </main>
  )
}
