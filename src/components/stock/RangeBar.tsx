import { inr } from '../../lib/format'

export function RangeBar({ label, low, high, current }: { label: string; low: number; high: number; current: number }) {
  const pos = Math.min(100, Math.max(0, ((current - low) / (high - low || 1)) * 100))
  return (
    <div>
      <div className="mb-2 text-xs text-ink-3">{label}</div>
      <div className="relative h-1.5 rounded-full bg-subtle">
        <div className="absolute inset-y-0 left-0 rounded-full bg-line-strong" style={{ width: `${pos}%` }} />
        <div className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow" style={{ left: `${pos}%` }} />
      </div>
      <div className="tnum mt-2 flex justify-between text-xs text-ink-2">
        <span>
          <span className="text-ink-3">Low </span>
          {inr(low)}
        </span>
        <span>
          <span className="text-ink-3">High </span>
          {inr(high)}
        </span>
      </div>
    </div>
  )
}
