import { ArrowUp, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { LensAnswerCard } from '../components/lens/LensAnswerCard'
import { TopBar } from '../components/layout/TopBar'
import { ChangeText } from '../components/ui/Change'
import { LensMark } from '../components/ui/LensMark'
import { StatementTag } from '../components/ui/StatementTag'
import { getStock } from '../data/stocks'
import type { Stock } from '../data/types'
import { inr } from '../lib/format'
import { useApp } from '../state/AppState'
import { NotFound } from './NotFound'

/** SCREEN 6 — Ask Lens: grounded follow-up questions about the selected stock. */
export function AskLensPage() {
  const { id } = useParams()
  const stock = getStock(id)
  const { chats, pending, ask, clearChat } = useApp()
  const [params, setParams] = useSearchParams()
  const [draft, setDraft] = useState('')
  const handledKey = useRef<string | null>(null)
  const bottom = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLTextAreaElement>(null)

  const stockId = stock?.id ?? ''
  const messages = chats[stockId] ?? []
  const isPending = !!pending[stockId]
  const q = params.get('q')

  // A question passed from Lens (suggested chip or typed) is asked once, then removed from the URL.
  useEffect(() => {
    if (!stock || !q || handledKey.current === q) return
    handledKey.current = q
    ask(stock.id, q)
    setParams({}, { replace: true })
  }, [q, stock, ask, setParams])

  useEffect(() => {
    if (messages.length || isPending) bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isPending])

  if (!stock) return <NotFound />

  const send = (text: string) => {
    if (!text.trim() || isPending) return
    ask(stock.id, text)
    setDraft('')
  }
  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(draft)
  }

  return (
    <div className="flex min-h-dvh flex-col lg:min-h-[calc(100dvh-4rem)]">
      <TopBar
        back={`/stock/${stock.id}/lens`}
        title={
          <span className="flex items-center gap-1.5">
            <LensMark className="size-4 text-lens" />
            Ask Lens
          </span>
        }
        subtitle={`About ${stock.name}`}
        right={
          messages.length > 0 ? (
            <button onClick={() => clearChat(stock.id)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-ink-3 hover:bg-subtle hover:text-ink-2">
              <RotateCcw className="size-3.5" aria-hidden="true" />
              New chat
            </button>
          ) : undefined
        }
      />

      <div className="mx-auto flex w-full max-w-6xl flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8 lg:px-6">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col lg:bg-white lg:border-x lg:border-line">
          <div className="flex-1 px-4 pb-6 pt-5 sm:px-6" aria-live="polite">
            {messages.length === 0 && !isPending ? (
              <EmptyState stock={stock} onPick={send} />
            ) : (
              <ol className="space-y-6">
                {messages.map((m) =>
                  m.role === 'user' ? (
                    <li key={m.id} className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[15px] leading-relaxed text-white">{m.text}</p>
                    </li>
                  ) : (
                    <li key={m.id}>{m.answer && <LensAnswerCard answer={m.answer} onFollowUp={send} />}</li>
                  ),
                )}
                {isPending && (
                  <li className="flex items-center gap-2 text-sm text-ink-3" aria-label="Lens is answering">
                    <LensMark className="size-3.5 text-lens" />
                    Checking {stock.shortName}’s data
                    <span className="flex gap-1" aria-hidden="true">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="size-1 animate-pulse rounded-full bg-ink-3" style={{ animationDelay: `${i * 150}ms` }} />
                      ))}
                    </span>
                  </li>
                )}
              </ol>
            )}
            <div ref={bottom} />
          </div>

          <form onSubmit={onSubmit} className="sticky bottom-0 border-t border-line bg-white px-3 pt-3 pb-safe sm:px-6">
            <div className="flex items-end gap-2 rounded-2xl border border-line-strong bg-white p-1.5 pl-4 focus-within:border-lens focus-within:ring-2 focus-within:ring-lens/15">
              <label htmlFor="ask-input" className="sr-only">
                Ask about {stock.shortName}
              </label>
              <textarea
                id="ask-input"
                ref={input}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send(draft)
                  }
                }}
                placeholder="What do you want to understand?"
                className="max-h-32 min-w-0 flex-1 resize-none bg-transparent py-2 text-[15px] leading-6 outline-none placeholder:text-ink-3"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isPending}
                className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-white transition-opacity disabled:opacity-25"
                aria-label="Send"
              >
                <ArrowUp className="size-4" />
              </button>
            </div>
            <p className="py-2 text-center text-[11px] text-ink-3">Lens explains, it doesn’t advise. Answers use this prototype’s demo data only.</p>
          </form>
        </div>

        <ContextRail stock={stock} onPick={send} />
      </div>
    </div>
  )
}

function EmptyState({ stock, onPick }: { stock: Stock; onPick: (q: string) => void }) {
  return (
    <div className="animate-fade-in pt-4">
      <div className="grid size-10 place-items-center rounded-xl bg-lens-soft text-lens">
        <LensMark className="size-5" />
      </div>
      <h1 className="mt-4 text-xl font-semibold tracking-tight">What do you want to understand about {stock.shortName}?</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
        Answers come only from {stock.shortName}’s data in this prototype, and keep facts separate from interpretation.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <StatementTag kind="fact" />
        <StatementTag kind="interpretation" />
        <StatementTag kind="uncertainty" />
      </div>
      <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
        {stock.suggestedQuestions.map((s) => (
          <li key={s}>
            <button onClick={() => onPick(s)} className="w-full px-4 py-3 text-left text-[15px] text-ink hover:bg-subtle/70">
              {s}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Desktop-only rail showing what the answers are grounded in. */
function ContextRail({ stock, onPick }: { stock: Stock; onPick: (q: string) => void }) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-[8.5rem] space-y-5 pt-5">
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="text-xs font-medium text-ink-3">Context</div>
          <Link to={`/stock/${stock.id}/lens`} className="mt-1 block font-semibold hover:underline">
            {stock.name}
          </Link>
          <div className="tnum mt-0.5 text-sm">
            {inr(stock.price)} <ChangeText value={stock.dailyChange} suffix="today" />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="text-sm font-semibold">Answers are grounded in</div>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-2">
            <li>Price, sector and market data</li>
            <li>{stock.recentEvents.length} recent events</li>
            <li>{stock.risks.length} risks & counterpoints</li>
            <li>Key ratios</li>
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-ink-3">
            If something isn’t in this data, Lens says so instead of guessing. It won’t recommend buying or selling, or predict
            prices.
          </p>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium text-ink-3">Try asking</div>
          <ul className="space-y-1.5">
            {['Should I buy this?', 'Will it rise tomorrow?', 'What is P/E?', 'Why did it fall last month?'].map((s) => (
              <li key={s}>
                <button onClick={() => onPick(s)} className="text-left text-sm text-ink-2 underline decoration-line-strong underline-offset-2 hover:text-lens-ink">
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
