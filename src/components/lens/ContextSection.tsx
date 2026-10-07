import { Info } from 'lucide-react'
import { useState } from 'react'
import { getStock } from '../../data/stocks'
import type { ExplainLevel, Stock } from '../../data/types'
import { classifyMovement, type Period } from '../../lib/movement'
import { useApp } from '../../state/AppState'
import { ComparisonBars, type BarRow } from '../stock/ComparisonBars'
import { GlossaryText } from '../ui/GlossaryText'
import { Segmented } from '../ui/Segmented'
import { StatementTag } from '../ui/StatementTag'
import { LensSection, SectionHeader } from './SectionHeader'

export function ContextSection({ stock, level }: { stock: Stock; level: ExplainLevel }) {
  const { showTips } = useApp()
  const [period, setPeriod] = useState<Period>('today')
  const v = classifyMovement(stock, period)
  const today = period === 'today'
  const peers = stock.peerIds.map((id) => getStock(id)).filter((p): p is Stock => !!p)
  const rows: BarRow[] = [
    { label: stock.shortName, sublabel: 'This stock', value: today ? stock.dailyChange : stock.weeklyChange, emphasis: true },
    { label: stock.sectorIndex, sublabel: 'Its sector', value: today ? stock.sectorChange : stock.sectorWeeklyChange },
    { label: 'Nifty 50', sublabel: 'Overall market', value: today ? stock.marketChange : stock.marketWeeklyChange },
    ...peers.map((p) => ({ label: p.shortName, sublabel: 'Peer', value: today ? p.dailyChange : p.weeklyChange })),
  ]
  return (
    <LensSection id="context" label="Market and sector context">
      <SectionHeader
        n={3}
        question="Market & sector context"
        takeaway={v.label}
        right={
          <Segmented
            size="sm"
            label="Comparison period"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: '1W' },
            ]}
          />
        }
      />
      <div className="mt-5">
        <ComparisonBars rows={rows} caption={`${stock.shortName} compared with its sector and the market, ${today ? 'today' : 'past week'}`} />
      </div>
      <div className="mt-5 flex items-start gap-2.5">
        <StatementTag kind="interpretation" className="mt-0.5" />
        <p className="text-[15px] leading-relaxed text-ink">
          <GlossaryText text={level === 'simple' ? v.simple : v.explanation} limit={1} />
        </p>
      </div>
      {showTips && (
        <div className="mt-4 flex gap-2.5 rounded-xl bg-subtle px-3.5 py-3 text-[13px] leading-relaxed text-ink-2">
          <Info className="mt-0.5 size-4 shrink-0 text-ink-3" aria-hidden="true" />
          <p>
            <span className="font-semibold text-ink">Why compare?</span> If the whole sector is moving, the move may not be
            about this company at all.
          </p>
        </div>
      )}
    </LensSection>
  )
}
