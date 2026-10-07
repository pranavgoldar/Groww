import { CircleHelp } from 'lucide-react'
import { useState } from 'react'
import { EvidenceMeter } from '../ui/EvidenceMeter'
import { Sheet } from '../ui/Sheet'
import { StatementTag } from '../ui/StatementTag'

/** Explains the three statement types up front — the core trust mechanic of Lens. */
export function LensLegend() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className="flex flex-wrap items-center gap-1.5">
        <StatementTag kind="fact" />
        <StatementTag kind="interpretation" />
        <StatementTag kind="uncertainty" />
        <button
          onClick={() => setOpen(true)}
          aria-label="How to read Lens"
          title="How to read Lens"
          className="inline-flex items-center gap-1 rounded-md p-1 text-xs font-medium text-ink-3 hover:text-ink-2"
        >
          <CircleHelp className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">How to read Lens</span>
        </button>
      </div>
      <Sheet open={open} onClose={() => setOpen(false)} title="How to read Lens">
        <p className="text-sm leading-relaxed text-ink-2">
          Lens keeps three kinds of statements separate, so you always know how much weight to give each one.
        </p>
        <dl className="mt-4 space-y-4">
          <div>
            <dt><StatementTag kind="fact" /></dt>
            <dd className="mt-1.5 text-sm text-ink-2">Directly supported by the data — prices, index moves, announcements.</dd>
          </div>
          <div>
            <dt><StatementTag kind="interpretation" /></dt>
            <dd className="mt-1.5 text-sm text-ink-2">What the information may indicate. Reasonable, but not proven.</dd>
          </div>
          <div>
            <dt><StatementTag kind="uncertainty" /></dt>
            <dd className="mt-1.5 text-sm text-ink-2">What can’t be established with confidence.</dd>
          </div>
          <div>
            <dt><EvidenceMeter strength="moderate" /></dt>
            <dd className="mt-1.5 text-sm text-ink-2">How strongly the available information supports a possible driver.</dd>
          </div>
        </dl>
        <p className="mt-5 rounded-lg bg-subtle px-3 py-2.5 text-[13px] leading-relaxed text-ink-2">
          Lens explains. It never tells you what to buy or sell, and it doesn’t predict prices.
        </p>
      </Sheet>
    </>
  )
}
