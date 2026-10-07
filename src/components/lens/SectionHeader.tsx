import type { ReactNode } from 'react'

/** Numbered section header: the question as the heading, the takeaway as the first thing you read. */
export function SectionHeader({
  n,
  question,
  takeaway,
  right,
}: {
  n: number
  question: string
  takeaway: ReactNode
  right?: ReactNode
}) {
  return (
    <header className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.06em] text-ink-3">
          <span className="tnum grid size-5 place-items-center rounded-full bg-ink text-[11px] font-semibold tracking-normal text-white" aria-hidden="true">
            {n}
          </span>
          {question}
        </h2>
        <p className="mt-2 text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink">{takeaway}</p>
      </div>
      {right && <div className="shrink-0 pt-0.5">{right}</div>}
    </header>
  )
}

export function LensSection({ id, children, label }: { id: string; children: ReactNode; label: string }) {
  return (
    <section id={id} aria-label={label} className="scroll-mt-28 bg-white px-4 py-6 sm:px-6 lg:scroll-mt-36 lg:rounded-2xl lg:border lg:border-line lg:px-7 lg:py-7">
      {children}
    </section>
  )
}
