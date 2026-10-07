import type { StatementKind } from '../../data/types'

const STYLES: Record<StatementKind, { label: string; cls: string; dot: string }> = {
  fact: { label: 'Fact', cls: 'bg-fact-soft text-fact', dot: 'bg-fact' },
  interpretation: { label: 'Interpretation', cls: 'bg-lens-soft text-lens-ink', dot: 'bg-lens' },
  uncertainty: { label: 'Uncertainty', cls: 'bg-caution-soft text-caution-ink', dot: 'border border-caution bg-transparent' },
}

/** Labels every Lens statement as a fact, an interpretation, or an uncertainty. */
export function StatementTag({ kind, className = '' }: { kind: StatementKind; className?: string }) {
  const s = STYLES[kind]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-[3px] text-[10.5px] font-semibold uppercase leading-none tracking-[0.04em] ${s.cls} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {s.label}
    </span>
  )
}

export const STATEMENT_BORDER: Record<StatementKind, string> = {
  fact: 'border-fact/25',
  interpretation: 'border-lens/40',
  uncertainty: 'border-caution/45 border-dashed',
}
