import { ArrowUp } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Stock } from '../../data/types'
import { LensSection, SectionHeader } from './SectionHeader'

export function AskSection({ stock }: { stock: Stock }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const go = (question: string) => navigate(`/stock/${stock.id}/ask?q=${encodeURIComponent(question)}`)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (q.trim()) go(q.trim())
  }
  return (
    <LensSection id="ask" label="Ask Lens">
      <SectionHeader n={5} question="Ask Lens" takeaway="What do you want to understand?" />
      <form onSubmit={submit} className="mt-4 flex items-center gap-2 rounded-2xl border border-line-strong bg-white p-1.5 pl-4 focus-within:border-lens focus-within:ring-2 focus-within:ring-lens/15">
        <label htmlFor="ask-lens-input" className="sr-only">
          Ask a question about {stock.shortName}
        </label>
        <input
          id="ask-lens-input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What do you want to understand?"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] outline-none placeholder:text-ink-3"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={!q.trim()}
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-ink text-white transition-opacity disabled:opacity-25"
          aria-label="Ask"
        >
          <ArrowUp className="size-4" />
        </button>
      </form>
      <div className="mt-4">
        <div className="text-xs font-medium text-ink-3">Try asking</div>
        <ul className="mt-2 flex flex-wrap gap-2">
          {stock.suggestedQuestions.map((s) => (
            <li key={s}>
              <button
                onClick={() => go(s)}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:border-lens/40 hover:text-lens-ink"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </LensSection>
  )
}
