import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { StockRow } from '../components/stock/StockRow'
import { ChangeText } from '../components/ui/Change'
import { DemoBadge } from '../components/ui/DemoBadge'
import { PriceChart } from '../components/ui/PriceChart'
import { Segmented } from '../components/ui/Segmented'
import { StatementTag } from '../components/ui/StatementTag'
import { getIndex } from '../data/indices'
import { getStock } from '../data/stocks'
import type { ChartRange, Stock } from '../data/types'
import { num, previousClose } from '../lib/format'
import { seriesFor, type SeriesPoint } from '../lib/series'
import { NotFound } from './NotFound'

export function IndexDetailPage() {
  const { id } = useParams()
  const idx = getIndex(id)
  const [range, setRange] = useState<ChartRange>('1D')
  const [scrub, setScrub] = useState<SeriesPoint | null>(null)
  const series = useMemo(() => (idx ? seriesFor(idx, range) : []), [idx, range])
  if (!idx) return <NotFound />

  const base = range === '1D' ? previousClose(idx.value, idx.dailyChange) : series[0].value
  const shown = scrub?.value ?? idx.value
  const constituents = idx.constituentIds.map((c) => getStock(c)).filter((s): s is Stock => !!s)

  return (
    <>
      <TopBar back="/" title={idx.name} subtitle="Index" />
      <main className="mx-auto max-w-3xl space-y-2 bg-subtle pb-10 lg:space-y-4 lg:bg-transparent lg:px-6 lg:py-6">
        <section className="bg-white px-4 py-5 sm:px-6 lg:rounded-2xl lg:border lg:border-line">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-xl font-semibold">{idx.name}</h1>
            <DemoBadge />
          </div>
          <p className="mt-1 text-sm text-ink-2">{idx.description}</p>
          <div className="tnum mt-4 text-[30px] font-semibold leading-none tracking-tight">{num(shown)}</div>
          <div className="mt-2 text-sm">
            <ChangeText value={((shown - base) / base) * 100} />{' '}
            <span className="text-ink-3">{scrub ? scrub.label : range === '1D' ? 'today' : `past ${range === '1W' ? 'week' : range === '1M' ? 'month' : 'year'}`}</span>
          </div>
          <div className="mt-6">
            <PriceChart series={series} baseline={range === '1D' ? base : undefined} onScrub={setScrub} label={`${idx.name} chart. Illustrative data.`} />
          </div>
          <div className="mt-4">
            <Segmented<ChartRange>
              label="Chart range"
              value={range}
              onChange={(r) => {
                setRange(r)
                setScrub(null)
              }}
              options={(['1D', '1W', '1M', '1Y'] as ChartRange[]).map((r) => ({ value: r, label: r }))}
            />
          </div>
        </section>

        <section className="bg-white px-4 py-5 sm:px-6 lg:rounded-2xl lg:border lg:border-line">
          <h2 className="text-base font-semibold">What’s happening</h2>
          <div className="mt-3 space-y-3">
            {(
              [
                ['fact', idx.context.fact],
                ['interpretation', idx.context.interpretation],
                ['uncertainty', idx.context.uncertainty],
              ] as const
            ).map(([kind, text]) => (
              <div key={kind} className="flex items-start gap-2.5">
                <StatementTag kind={kind} className="mt-0.5" />
                <p className="text-[15px] leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white py-5 lg:rounded-2xl lg:border lg:border-line">
          <h2 className="px-4 text-base font-semibold sm:px-6 lg:px-5">In this index</h2>
          <p className="px-4 text-sm text-ink-3 sm:px-6 lg:px-5">Stocks from this prototype. Open one to see its Lens.</p>
          <ul className="mt-2 divide-y divide-line">
            {constituents.map((s) => (
              <li key={s.id}>
                <StockRow stock={s} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  )
}
