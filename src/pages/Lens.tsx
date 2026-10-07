import { Link, useParams } from 'react-router-dom'
import { AskSection } from '../components/lens/AskSection'
import { ChangedSection } from '../components/lens/ChangedSection'
import { ContextSection } from '../components/lens/ContextSection'
import { LensLegend } from '../components/lens/LensLegend'
import { RisksSection } from '../components/lens/RisksSection'
import { LENS_SECTION_IDS, SectionRail, SectionTabs } from '../components/lens/SectionNav'
import { WhySection } from '../components/lens/WhySection'
import { TopBar } from '../components/layout/TopBar'
import { ChangeText } from '../components/ui/Change'
import { DemoBadge } from '../components/ui/DemoBadge'
import { GlossaryText } from '../components/ui/GlossaryText'
import { LensMark } from '../components/ui/LensMark'
import { Segmented } from '../components/ui/Segmented'
import { getStock } from '../data/stocks'
import type { ExplainLevel } from '../data/types'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { changeFromPct, inr, signedInr } from '../lib/format'
import { useApp } from '../state/AppState'
import { NotFound } from './NotFound'

/**
 * GROWW LENS — the hero screen.
 * Fixed hierarchy: Why is it moving? → What changed? → Context → Risks → Ask Lens.
 */
export function LensPage() {
  const { id } = useParams()
  const stock = getStock(id)
  const { prefs, updatePrefs } = useApp()
  const active = useScrollSpy(LENS_SECTION_IDS)
  if (!stock) return <NotFound />
  const level = prefs.level

  const levelToggle = (
    <Segmented<ExplainLevel>
      size="sm"
      label="Explanation style"
      value={level}
      onChange={(v) => updatePrefs({ level: v })}
      options={[
        { value: 'simple', label: 'Simple' },
        { value: 'standard', label: 'Standard' },
      ]}
    />
  )

  return (
    <>
      <TopBar
        back={`/stock/${stock.id}`}
        border={false}
        title={
          <span className="flex items-center gap-1.5">
            <LensMark className="size-4 text-lens" />
            Lens
          </span>
        }
        subtitle={stock.name}
        right={<div className="lg:hidden">{levelToggle}</div>}
      />

      <main className="mx-auto max-w-6xl lg:grid lg:grid-cols-[232px_minmax(0,1fr)] lg:gap-8 lg:px-6 lg:pb-16 lg:pt-6">
        {/* Desktop rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-[8.5rem] space-y-6">
            <div className="rounded-2xl border border-line bg-white p-4">
              <Link to={`/stock/${stock.id}`} className="text-sm font-semibold hover:underline">
                {stock.name}
              </Link>
              <div className="tnum mt-1 text-lg font-semibold">{inr(stock.price)}</div>
              <ChangeText value={stock.dailyChange} suffix="today" className="text-sm" />
            </div>
            <SectionRail active={active} />
            <div className="px-1">
              <div className="mb-2 text-xs font-medium text-ink-3">Explanation style</div>
              {levelToggle}
            </div>
          </div>
        </aside>

        <div className="min-w-0 lg:max-w-[760px]">
          {/* Summary header — the 10-second read */}
          <header className="border-b border-line bg-white px-4 pb-5 pt-1 sm:px-6 lg:rounded-2xl lg:border lg:px-7 lg:pt-6">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h1 className="truncate text-[15px] font-semibold text-ink">{stock.name}</h1>
                <div className="truncate text-xs text-ink-3">
                  {stock.ticker} · {stock.sector}
                  <span className="lg:hidden"> · Demo data, not real-time</span>
                </div>
              </div>
              <DemoBadge className="hidden shrink-0 lg:inline-flex" />
            </div>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="tnum text-[28px] font-semibold tracking-tight">{inr(stock.price)}</span>
              <ChangeText value={stock.dailyChange} className="text-base" suffix="today" />
              <span className="tnum text-sm text-ink-3">({signedInr(changeFromPct(stock.price, stock.dailyChange))})</span>
            </div>
            <p className="mt-3 text-[16px] leading-relaxed text-ink">
              <GlossaryText text={level === 'simple' ? stock.lensSummary.simple : stock.lensSummary.standard} />
            </p>
            <div className="mt-4">
              <LensLegend />
            </div>
          </header>

          <SectionTabs active={active} />

          <div className="space-y-2 bg-subtle lg:mt-4 lg:space-y-4 lg:bg-transparent">
            <WhySection stock={stock} level={level} />
            <ChangedSection stock={stock} />
            <ContextSection stock={stock} level={level} />
            <RisksSection stock={stock} level={level} />
            <AskSection stock={stock} />
          </div>

          <footer className="bg-subtle px-4 pb-10 pt-6 text-xs leading-relaxed text-ink-3 sm:px-6 lg:bg-transparent lg:px-1">
            <p>
              <span className="font-semibold text-ink-2">Lens explains — it doesn’t recommend.</span> Nothing here is investment
              advice or a prediction. All prices, events and figures are illustrative demo data, not real-time market information.
            </p>
          </footer>
        </div>
      </main>
    </>
  )
}
