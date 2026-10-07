import { Fragment, useMemo } from 'react'
import { escapeRegExp, INLINE_GLOSSARY_ALIASES } from '../../data/glossary'
import { useApp } from '../../state/AppState'
import { useGlossary } from '../../state/Glossary'

const PATTERN = new RegExp(
  `(^|[^A-Za-z0-9])(${INLINE_GLOSSARY_ALIASES.map((a) => escapeRegExp(a.alias)).join('|')})(?=[^A-Za-z0-9]|$)`,
  'gi',
)
const BY_ALIAS = new Map(INLINE_GLOSSARY_ALIASES.map((a) => [a.alias, a.entry]))

/**
 * Renders text with jargon turned into tappable definitions — for first-time investors.
 * Only the first occurrence of each term (max `limit`) is marked, to avoid clutter.
 * Hidden for users who said they actively follow markets.
 */
const NONE: string[] = []

export function GlossaryText({ text, limit = 2, skip = NONE }: { text: string; limit?: number; skip?: string[] }) {
  const { showTips } = useApp()
  const openTerm = useGlossary()

  const parts = useMemo(() => {
    if (!showTips) return [text]
    const out: Array<string | { term: string; id: string }> = []
    const used = new Set(skip)
    let last = 0
    for (const m of text.matchAll(PATTERN)) {
      const entry = BY_ALIAS.get(m[2].toLowerCase())
      if (!entry || used.has(entry.id) || used.size - skip.length >= limit) continue
      const start = m.index! + m[1].length
      out.push(text.slice(last, start), { term: m[2], id: entry.id })
      last = start + m[2].length
      used.add(entry.id)
    }
    out.push(text.slice(last))
    return out
  }, [text, showTips, limit, skip])

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <button
            key={i}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              openTerm(p.id)
            }}
            className="inline cursor-help underline decoration-ink-3/60 decoration-dotted decoration-[1.5px] underline-offset-[3px] hover:decoration-ink-2"
            aria-label={`${p.term} — show definition`}
          >
            {p.term}
          </button>
        ),
      )}
    </>
  )
}
