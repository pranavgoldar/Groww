import { Link } from 'react-router-dom'
import type { ExplainLevel, Stock } from '../../data/types'
import { moveFact } from '../../lib/lensCopy'
import { EvidenceMeter } from '../ui/EvidenceMeter'
import { GlossaryText } from '../ui/GlossaryText'
import { StatementTag } from '../ui/StatementTag'
import { LensSection, SectionHeader } from './SectionHeader'

export function WhySection({ stock, level }: { stock: Stock; level: ExplainLevel }) {
  const w = stock.whyMoving
  return (
    <LensSection id="why" label="Why is it moving?">
      <SectionHeader n={1} question="Why is it moving?" takeaway={w.headline} />

      <div className="mt-4 flex items-start gap-2.5">
        <StatementTag kind="fact" className="mt-0.5" />
        <p className="text-[15px] leading-relaxed text-ink">{moveFact(stock)}</p>
      </div>

      <ol className="mt-5 divide-y divide-line border-y border-line">
        {w.drivers.map((d, i) => {
          const events = (d.eventIds ?? []).map((id) => stock.recentEvents.find((e) => e.id === id)).filter(Boolean)
          return (
            <li key={d.id} className="flex gap-3 py-4">
              <span className="tnum mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line text-xs font-semibold text-ink-2">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-semibold leading-snug">{d.title}</h3>
                <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
                  <GlossaryText text={level === 'simple' ? d.text.simple : d.text.standard} />
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                  <StatementTag kind="interpretation" />
                  <EvidenceMeter strength={d.evidence} />
                </div>
                <p className="mt-1.5 text-xs text-ink-3">
                  Based on:{' '}
                  {events.length ? (
                    events.map((e, j) => (
                      <span key={e!.id}>
                        {j > 0 && ', '}
                        <Link to={`/stock/${stock.id}/lens/timeline?event=${e!.id}`} className="font-medium text-ink-2 underline decoration-line-strong underline-offset-2 hover:text-lens">
                          {e!.title} ({e!.date})
                        </Link>
                      </span>
                    ))
                  ) : (
                    d.basis
                  )}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-5 rounded-xl border border-dashed border-caution/40 bg-caution-soft/60 px-4 py-3.5">
        <StatementTag kind="uncertainty" />
        <p className="mt-2 text-sm leading-relaxed text-ink">{level === 'simple' ? w.uncertainty.simple : w.uncertainty.standard}</p>
      </div>
    </LensSection>
  )
}
