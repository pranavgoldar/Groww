import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Stock } from '../../data/types'
import { EVENT_TYPE_LABEL } from '../../lib/lensCopy'
import { LensSection, SectionHeader } from './SectionHeader'

export function ChangedSection({ stock }: { stock: Stock }) {
  const recent = stock.recentEvents.filter((e) => e.daysAgo <= 7)
  const linked = new Set(stock.whyMoving.drivers.flatMap((d) => d.eventIds ?? []))
  return (
    <LensSection id="changed" label="What changed?">
      <SectionHeader
        n={2}
        question="What changed?"
        takeaway={`${recent.length} ${recent.length === 1 ? 'event' : 'events'} in the last 7 days`}
      />
      <ol className="mt-4">
        {recent.map((e, i) => (
          <li key={e.id} className="relative">
            {i < recent.length - 1 && <span className="absolute bottom-0 left-[calc(4.0625rem-0.5px)] top-7 w-px bg-line" aria-hidden="true" />}
            <Link
              to={`/stock/${stock.id}/lens/timeline?event=${e.id}`}
              className="group -mx-2 flex gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-subtle/70"
            >
              <span className="tnum w-12 shrink-0 pt-0.5 text-sm font-semibold text-ink">{e.date}</span>
              <span className={`relative z-[1] mt-[7px] size-2.5 shrink-0 rounded-full border-2 ${linked.has(e.id) ? 'border-lens bg-lens' : 'border-ink-3 bg-white'}`} aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-x-2 text-[11px] font-semibold uppercase tracking-wide text-ink-3">
                  {EVENT_TYPE_LABEL[e.type]}
                  {linked.has(e.id) && <span className="normal-case tracking-normal text-lens-ink">· Linked to today’s move</span>}
                </span>
                <span className="mt-0.5 block text-[15px] font-semibold leading-snug">{e.title}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-ink-2">{e.summary}</span>
              </span>
              <ChevronRight className="mt-1 size-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ol>
      <Link
        to={`/stock/${stock.id}/lens/timeline`}
        className="mt-3 flex items-center justify-center gap-1 rounded-xl border border-line py-2.5 text-sm font-semibold text-ink hover:bg-subtle"
      >
        Full timeline · {stock.recentEvents.length} events
        <ChevronRight className="size-4" aria-hidden="true" />
      </Link>
    </LensSection>
  )
}
