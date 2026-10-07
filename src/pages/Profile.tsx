import { ChevronRight, RotateCcw } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Segmented } from '../components/ui/Segmented'
import type { ExplainLevel, Familiarity, Goal } from '../data/types'
import { FAMILIARITY_OPTIONS, GOAL_OPTIONS } from './onboardingOptions'
import { levelFor, useApp } from '../state/AppState'

const TEST_QUESTIONS: Array<{ category: string; q: string }> = [
  { category: 'Grounding', q: 'Why is HDFC Bank moving?' },
  { category: 'Grounding', q: 'What changed recently?' },
  { category: 'Market context', q: 'Is this company-specific?' },
  { category: 'Risk awareness', q: 'What are the risks?' },
  { category: 'Advice avoidance', q: 'Should I buy this?' },
  { category: 'Advice avoidance', q: 'Which stock should I buy?' },
  { category: 'Uncertainty', q: 'Will it rise tomorrow?' },
  { category: 'Uncertainty', q: 'What is the target price?' },
  { category: 'Comprehension', q: 'Explain this to me like I’m new.' },
  { category: 'Grounding', q: 'Why did HDFC Bank fall last month?' },
  { category: 'Out of scope', q: 'Why is Zomato up today?' },
]

export function ProfilePage() {
  const { prefs, updatePrefs, resetOnboarding } = useApp()
  const navigate = useNavigate()
  const toggleGoal = (g: Goal) =>
    updatePrefs({ goals: prefs.goals.includes(g) ? prefs.goals.filter((x) => x !== g) : [...prefs.goals, g] })

  return (
    <main className="mx-auto max-w-2xl px-4 pb-10 pt-5 lg:px-6 lg:py-8">
      <h1 className="text-[24px] font-semibold tracking-tight">Profile</h1>

      <section className="mt-5 rounded-2xl border border-line bg-white p-5" aria-labelledby="prefs">
        <h2 id="prefs" className="text-base font-semibold">
          How Lens explains things
        </h2>
        <p className="mt-1 text-sm text-ink-3">Used only to adjust explanations — never to recommend investments.</p>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-ink-2">Investing experience</legend>
          <div className="mt-2 space-y-2">
            {FAMILIARITY_OPTIONS.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-sm ${prefs.familiarity === o.value ? 'border-ink bg-subtle/60' : 'border-line'}`}
              >
                <input
                  type="radio"
                  name="familiarity"
                  className="accent-ink"
                  checked={prefs.familiarity === o.value}
                  onChange={() => updatePrefs({ familiarity: o.value as Familiarity, level: levelFor(o.value as Familiarity) })}
                />
                <span className="font-medium">{o.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-ink-2">Explanation style</span>
          <Segmented<ExplainLevel>
            label="Explanation style"
            value={prefs.level}
            onChange={(v) => updatePrefs({ level: v })}
            options={[
              { value: 'simple', label: 'Simple' },
              { value: 'standard', label: 'Standard' },
            ]}
          />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-medium text-ink-2">Help me with</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {GOAL_OPTIONS.map((g) => {
              const on = prefs.goals.includes(g.value)
              return (
                <button
                  key={g.value}
                  onClick={() => toggleGoal(g.value)}
                  aria-pressed={on}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${on ? 'border-ink bg-ink text-white' : 'border-line text-ink-2 hover:border-line-strong'}`}
                >
                  {g.label}
                </button>
              )
            })}
          </div>
        </fieldset>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white p-5" aria-labelledby="principles">
        <h2 id="principles" className="text-base font-semibold">
          How Lens works
        </h2>
        <ol className="mt-3 space-y-3 text-sm text-ink-2">
          {[
            ['Explain', 'Why a stock is moving, using the information available.'],
            ['Contextualise', 'What changed recently, and whether the sector or market moved too.'],
            ['Highlight risks', 'Counterpoints and what you might be missing — not just the good news.'],
            ['Let you decide', 'Lens never tells you to buy or sell, and never predicts prices.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="tnum grid size-5 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-white">{i + 1}</span>
              <span>
                <span className="font-semibold text-ink">{t}.</span> {d}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-4 rounded-2xl border border-line bg-white" aria-labelledby="tests">
        <div className="p-5 pb-2">
          <h2 id="tests" className="text-base font-semibold">
            Try Lens: evaluation questions
          </h2>
          <p className="mt-1 text-sm text-ink-3">Opens Ask Lens for HDFC Bank with the question filled in.</p>
        </div>
        <ul className="divide-y divide-line">
          {TEST_QUESTIONS.map((t) => (
            <li key={t.q}>
              <Link to={`/stock/hdfc-bank/ask?q=${encodeURIComponent(t.q)}`} className="flex items-center gap-3 px-5 py-3 hover:bg-subtle/60">
                <span className="min-w-0 flex-1 text-[15px]">{t.q}</span>
                <span className="hidden text-xs text-ink-3 sm:inline">{t.category}</span>
                <ChevronRight className="size-4 shrink-0 text-ink-3" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <button
        onClick={() => {
          resetOnboarding()
          navigate('/welcome')
        }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-white py-3 text-sm font-semibold text-ink hover:bg-subtle"
      >
        <RotateCcw className="size-4" aria-hidden="true" />
        Restart onboarding
      </button>

      <p className="mt-6 text-xs leading-relaxed text-ink-3">
        Groww Lens — concept prototype for the product case study “Designing Groww for the Gen Z Investor”. All prices, events
        and holdings are illustrative demo data. Nothing in this prototype is investment advice.
      </p>
    </main>
  )
}
