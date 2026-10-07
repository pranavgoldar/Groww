import { useMemo } from 'react'

/** Tiny trend line for list rows. Decorative — the adjacent number carries the meaning. */
export function Sparkline({ values, className = 'h-8 w-20' }: { values: number[]; className?: string }) {
  const { d, up } = useMemo(() => {
    const min = Math.min(...values)
    const max = Math.max(...values)
    const span = max - min || 1
    const pts = values.map((v, i) => `${((i / (values.length - 1)) * 100).toFixed(2)},${(30 - ((v - min) / span) * 28 - 1).toFixed(2)}`)
    return { d: `M${pts.join(' L')}`, up: values[values.length - 1] >= values[0] }
  }, [values])
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d={d} fill="none" stroke={up ? 'var(--color-gain)' : 'var(--color-loss)'} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}
