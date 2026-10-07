import type { EvidenceStrength } from '../../data/types'

const LEVEL: Record<EvidenceStrength, { n: number; label: string }> = {
  strong: { n: 3, label: 'Strong evidence' },
  moderate: { n: 2, label: 'Moderate evidence' },
  limited: { n: 1, label: 'Limited evidence' },
}

/** How well the available information supports a factor — shown so users can calibrate trust. */
export function EvidenceMeter({ strength }: { strength: EvidenceStrength }) {
  const { n, label } = LEVEL[strength]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-2">
      <span className="flex gap-[3px]" aria-hidden="true">
        {[1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 w-3 rounded-full ${i <= n ? 'bg-ink-2' : 'bg-line-strong'}`} />
        ))}
      </span>
      {label}
    </span>
  )
}
