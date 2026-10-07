import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Stock } from '../../data/types'
import { lensQuestion } from '../../lib/lensCopy'
import { LensMark } from '../ui/LensMark'

/** The primary entry point into Lens from a stock page. */
export function LensEntryCard({ stock }: { stock: Stock }) {
  const recent = stock.recentEvents.filter((e) => e.daysAgo <= 7).length
  return (
    <section aria-label="Groww Lens" className="rounded-2xl border border-lens/20 bg-lens-soft/70 p-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-lens-ink">
        <LensMark className="size-3.5" />
        Lens
        <span className="font-normal text-ink-3">· Understand before you invest</span>
      </div>
      <p className="mt-2 text-[17px] font-semibold leading-snug text-ink">{lensQuestion(stock)}</p>
      <p className="mt-1 text-sm text-ink-2">
        {stock.whyMoving.headline.replace(/\.$/, '')} · {recent} recent events · {stock.risks.length} risks to weigh
      </p>
      <Link
        to={`/stock/${stock.id}/lens`}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-lens py-2.5 text-sm font-semibold text-white transition-colors hover:bg-lens-ink"
      >
        Open Lens
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  )
}
