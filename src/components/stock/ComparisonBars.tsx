import { pct } from '../../lib/format'

export interface BarRow {
  label: string
  sublabel?: string
  value: number
  emphasis?: boolean
}

/**
 * Diverging bars around zero: is the move company-specific, sector-wide or market-wide?
 * Values are direct-labelled in ink; colour only reinforces direction.
 */
export function ComparisonBars({ rows, caption }: { rows: BarRow[]; caption: string }) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)), 0.5) * 1.1
  const hasNegative = rows.some((r) => r.value < 0)
  const hasPositive = rows.some((r) => r.value > 0)
  // Put zero in the middle only when both directions are present.
  const zero = hasNegative && hasPositive ? 50 : hasNegative ? 100 : 0
  return (
    <figure>
      <figcaption className="sr-only">{caption}</figcaption>
      <ul className="space-y-3">
        {rows.map((r) => {
          const width = (Math.abs(r.value) / max) * (zero === 50 ? 50 : 100)
          const left = r.value >= 0 ? zero : zero - width
          const color = r.value >= 0 ? 'bg-gain' : 'bg-loss'
          return (
            <li key={r.label} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.75rem] items-center gap-3 sm:grid-cols-[9rem_minmax(0,1fr)_4rem]">
              <div className="min-w-0">
                <div className={`truncate text-sm ${r.emphasis ? 'font-semibold text-ink' : 'text-ink-2'}`}>{r.label}</div>
                {r.sublabel && <div className="truncate text-[11px] text-ink-3">{r.sublabel}</div>}
              </div>
              <div className="relative h-2.5 rounded-full bg-subtle" aria-hidden="true">
                {zero === 50 && <div className="absolute inset-y-[-3px] left-1/2 w-px bg-line-strong" />}
                <div
                  className={`absolute inset-y-0 rounded-full ${color} ${r.emphasis ? '' : 'opacity-45'}`}
                  style={{ left: `${left}%`, width: `${Math.max(width, 1.5)}%` }}
                />
              </div>
              <div className={`tnum text-right text-sm ${r.emphasis ? 'font-semibold text-ink' : 'text-ink-2'}`}>{pct(r.value)}</div>
            </li>
          )
        })}
      </ul>
    </figure>
  )
}
