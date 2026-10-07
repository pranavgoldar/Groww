import { ChevronDown, MessageCircleQuestion } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { TopBar } from '../components/layout/TopBar'
import { DemoBadge } from '../components/ui/DemoBadge'
import { GlossaryText } from '../components/ui/GlossaryText'
import { StatementTag } from '../components/ui/StatementTag'
import { getStock } from '../data/stocks'
import type { RecentEvent, Stock } from '../data/types'
import { EVENT_TYPE_LABEL } from '../lib/lensCopy'
import { useApp } from '../state/AppState'
import { NotFound } from './NotFound'

/** SCREEN 5 — "What changed?" expanded timeline with event details. */
export function LensTimelinePage() {
  const { id } = useParams()
  const stock = getStock(id)
  const [params, setParams] = useSearchParams()
  const selected = params.get('event')
  if (!stock) return <NotFound />

  const thisWeek = stock.recentEvents.filter((e) => e.daysAgo <= 7)
  const earlier = stock.recentEvents.filter((e) => e.daysAgo > 7)
  const toggle = (eventId: string) =>
    setParams(selected === eventId ? {} : { event: eventId }, { replace: true, preventScrollReset: true })

  return (
    <>
      <TopBar back={`/stock/${stock.id}/lens`} title="What changed?" subtitle={`${stock.name} · Lens`} />
      <main className="mx-auto max-w-2xl px-4 pb-16 pt-5 sm:px-6 lg:pt-8">
        <p className="text-[15px] leading-relaxed text-ink-2">
          The major events behind {stock.shortName}’s recent moves, newest first. Tap an event to see what happened, why it may
          matter, and what’s still unclear.
        </p>
        <div className="mt-3">
          <DemoBadge />
        </div>
        <EventGroup title="Last 7 days" events={thisWeek} stock={stock} selected={selected} onToggle={toggle} />
        {earlier.length > 0 && (
          <EventGroup title="Earlier this month" events={earlier} stock={stock} selected={selected} onToggle={toggle} />
        )}
        <p className="mt-8 text-xs leading-relaxed text-ink-3">
          This is not a complete news feed. It lists the events in this prototype’s data that are most relevant to understanding
          the stock’s recent movement. Events are illustrative samples, not real announcements.
        </p>
      </main>
    </>
  )
}

function EventGroup({
  title,
  events,
  stock,
  selected,
  onToggle,
}: {
  title: string
  events: RecentEvent[]
  stock: Stock
  selected: string | null
  onToggle: (id: string) => void
}) {
  return (
    <section className="mt-7">
      <h2 className="text-xs font-semibold uppercase tracking-[0.06em] text-ink-3">{title}</h2>
      <ol className="mt-3 space-y-2.5">
        {events.map((e) => (
          <EventItem key={e.id} event={e} stock={stock} open={selected === e.id} onToggle={() => onToggle(e.id)} />
        ))}
      </ol>
    </section>
  )
}

function EventItem({ event: e, stock, open, onToggle }: { event: RecentEvent; stock: Stock; open: boolean; onToggle: () => void }) {
  const { prefs } = useApp()
  const navigate = useNavigate()
  const ref = useRef<HTMLLIElement>(null)
  const [didScroll, setDidScroll] = useState(false)
  const drivers = stock.whyMoving.drivers.filter((d) => d.eventIds?.includes(e.id))

  useEffect(() => {
    if (open && !didScroll) {
      ref.current?.scrollIntoView({ block: 'center' })
      setDidScroll(true)
    }
  }, [open, didScroll])

  const panelId = `event-${e.id}`
  return (
    <li ref={ref} className={`rounded-2xl border bg-white transition-colors ${open ? 'border-line-strong shadow-sm' : 'border-line'}`}>
      <button onClick={onToggle} aria-expanded={open} aria-controls={panelId} className="flex w-full items-start gap-3 p-4 text-left">
        <span className="tnum w-12 shrink-0 pt-0.5 text-sm font-semibold">{e.date}</span>
        <span className="min-w-0 flex-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-3">
            {EVENT_TYPE_LABEL[e.type]}
            {drivers.length > 0 && <span className="normal-case tracking-normal text-lens-ink"> · Linked to today’s move</span>}
          </span>
          <span className="mt-0.5 block text-[15px] font-semibold leading-snug">{e.title}</span>
          {!open && <span className="mt-0.5 block text-sm text-ink-2">{e.summary}</span>}
        </span>
        <ChevronDown className={`mt-1 size-4 shrink-0 text-ink-3 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div id={panelId} className="animate-fade-in space-y-4 border-t border-line px-4 pb-4 pt-4 sm:pl-[4.75rem]">
          <Detail kind="fact" heading="What happened">
            <GlossaryText text={e.whatHappened} />
          </Detail>
          <Detail kind="interpretation" heading="Why it may matter">
            <GlossaryText text={prefs.level === 'simple' ? e.whyItMatters.simple : e.whyItMatters.standard} />
          </Detail>
          <Detail kind="uncertainty" heading="What’s unclear">
            {e.unclear}
          </Detail>
          {drivers.length > 0 && (
            <p className="text-sm text-ink-2">
              <span className="text-ink-3">Linked factor: </span>
              {drivers.map((d) => d.title).join(', ')}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <span className="text-xs text-ink-3">Source type: {e.sourceType}</span>
            <button
              onClick={() => navigate(`/stock/${stock.id}/ask?q=${encodeURIComponent(`Explain: ${e.title} (${e.date})`)}`)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[13px] font-semibold text-ink hover:bg-subtle"
            >
              <MessageCircleQuestion className="size-4" aria-hidden="true" />
              Ask Lens about this
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

function Detail({ kind, heading, children }: { kind: 'fact' | 'interpretation' | 'uncertainty'; heading: string; children: ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <StatementTag kind={kind} />
        <h3 className="text-xs font-medium text-ink-3">{heading}</h3>
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink">{children}</p>
    </div>
  )
}
