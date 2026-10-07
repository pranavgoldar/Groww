import { useEffect, useRef } from 'react'

export const LENS_SECTIONS = [
  { id: 'why', short: 'Why', label: 'Why is it moving?' },
  { id: 'changed', short: 'What changed', label: 'What changed?' },
  { id: 'context', short: 'Context', label: 'Market & sector context' },
  { id: 'risks', short: 'Risks', label: 'Risks & counterpoints' },
  { id: 'ask', short: 'Ask Lens', label: 'Ask Lens' },
]

export const LENS_SECTION_IDS = LENS_SECTIONS.map((s) => s.id)

function jump(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Mobile: sticky, horizontally scrolling tabs that mirror the Lens hierarchy. */
export function SectionTabs({ active }: { active: string }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Scroll the tab strip itself (not the page) so smooth page scrolling isn't interrupted.
    const el = bar.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (el && bar.current) bar.current.scrollTo({ left: el.offsetLeft - 12, behavior: 'smooth' })
  }, [active])
  return (
    <nav aria-label="Lens sections" className="sticky top-14 z-10 border-b border-line bg-white lg:hidden">
      <div ref={bar} className="no-scrollbar flex gap-1 overflow-x-auto px-3 py-2">
        {LENS_SECTIONS.map((s, i) => {
          const on = s.id === active
          return (
            <button
              key={s.id}
              data-id={s.id}
              onClick={() => jump(s.id)}
              aria-current={on ? 'true' : undefined}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors ${
                on ? 'bg-ink text-white' : 'text-ink-2 hover:bg-subtle'
              }`}
            >
              <span className={`tnum text-[11px] ${on ? 'text-white/70' : 'text-ink-3'}`}>{i + 1}</span>
              {s.short}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/** Desktop: vertical section index in the left rail. */
export function SectionRail({ active }: { active: string }) {
  return (
    <nav aria-label="Lens sections">
      <ol className="space-y-0.5">
        {LENS_SECTIONS.map((s, i) => {
          const on = s.id === active
          return (
            <li key={s.id}>
              <button
                onClick={() => jump(s.id)}
                aria-current={on ? 'true' : undefined}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                  on ? 'bg-white font-semibold text-ink shadow-sm ring-1 ring-line' : 'text-ink-2 hover:text-ink'
                }`}
              >
                <span
                  className={`tnum grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-semibold ${
                    on ? 'bg-ink text-white' : 'bg-line text-ink-2'
                  }`}
                >
                  {i + 1}
                </span>
                {s.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
