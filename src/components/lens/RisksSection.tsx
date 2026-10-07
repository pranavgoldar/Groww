import { TriangleAlert } from 'lucide-react'
import type { ExplainLevel, Stock } from '../../data/types'
import { GlossaryText } from '../ui/GlossaryText'
import { LensSection, SectionHeader } from './SectionHeader'

export function RisksSection({ stock, level }: { stock: Stock; level: ExplainLevel }) {
  return (
    <LensSection id="risks" label="Risks and counterpoints">
      <SectionHeader n={4} question="Risks & counterpoints" takeaway="What you might be missing" />
      <ul className="mt-4 divide-y divide-line">
        {stock.risks.map((r) => (
          <li key={r.id} className="flex gap-3 py-3.5">
            <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-caution-soft text-caution" aria-hidden="true">
              <TriangleAlert className="size-3.5" strokeWidth={2.2} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <h3 className="text-[15px] font-semibold leading-snug">{r.title}</h3>
                <span className="text-[11px] font-medium uppercase tracking-wide text-ink-3">{r.scope}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                <GlossaryText text={level === 'simple' ? r.detail.simple : r.detail.standard} limit={1} />
              </p>
            </div>
          </li>
        ))}
      </ul>
    </LensSection>
  )
}
