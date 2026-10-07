import { useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { SeriesPoint } from '../../lib/series'

const W = 100
const H = 40

/**
 * Single-series price line with a crosshair. Pointer, touch and arrow keys all scrub;
 * the parent receives the scrubbed point so the price header can follow it.
 */
export function PriceChart({
  series,
  baseline,
  onScrub,
  label,
  className = 'h-48 sm:h-56',
}: {
  series: SeriesPoint[]
  baseline?: number
  onScrub?: (p: SeriesPoint | null) => void
  label: string
  className?: string
}) {
  const gradientId = useId()
  const box = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<number | null>(null)

  const geo = useMemo(() => {
    const values = series.map((p) => p.value)
    const lo = Math.min(...values, baseline ?? Infinity)
    const hi = Math.max(...values, baseline ?? -Infinity)
    const pad = (hi - lo) * 0.12 || 1
    const min = lo - pad
    const max = hi + pad
    const x = (i: number) => (i / (series.length - 1)) * W
    const y = (v: number) => H - ((v - min) / (max - min)) * H
    const line = series.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(3)},${y(p.value).toFixed(3)}`).join(' ')
    const area = `${line} L${W},${H} L0,${H} Z`
    const reference = baseline ?? series[0].value
    const up = series[series.length - 1].value >= reference
    return { x, y, line, area, up, baseY: baseline !== undefined ? y(baseline) : undefined }
  }, [series, baseline])

  const color = geo.up ? 'var(--color-gain)' : 'var(--color-loss)'

  const setIndex = (i: number | null) => {
    setActive(i)
    onScrub?.(i === null ? null : series[i])
  }

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = box.current!.getBoundingClientRect()
    const frac = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width))
    setIndex(Math.round(frac * (series.length - 1)))
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const cur = active ?? series.length - 1
    setIndex(Math.min(series.length - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1))))
  }

  const point = active !== null ? series[active] : null
  const leftPct = active !== null ? (geo.x(active) / W) * 100 : 0
  const topPct = active !== null ? (geo.y(series[active].value) / H) * 100 : 0

  return (
    <div
      ref={box}
      className={`relative touch-pan-y select-none ${className}`}
      onPointerMove={onMove}
      onPointerDown={onMove}
      onPointerLeave={() => setIndex(null)}
      onBlur={() => setIndex(null)}
      onKeyDown={onKey}
      tabIndex={0}
      role="img"
      aria-label={label}
    >
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {geo.baseY !== undefined && (
          <line x1="0" x2={W} y1={geo.baseY} y2={geo.baseY} stroke="var(--color-line-strong)" strokeWidth="1" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
        )}
        <path d={geo.area} fill={`url(#${gradientId})`} />
        <path d={geo.line} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      {point && (
        <>
          <div className="pointer-events-none absolute inset-y-0 w-px bg-ink-3/40" style={{ left: `${leftPct}%` }} aria-hidden="true" />
          <div
            className="pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white"
            style={{ left: `${leftPct}%`, top: `${topPct}%`, background: color }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -top-1 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white"
            style={{ left: `clamp(2.5rem, ${leftPct}%, calc(100% - 2.5rem))` }}
          >
            {point.label}
          </div>
        </>
      )}
    </div>
  )
}
