import { ArrowLeft, Check } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Brand } from '../components/layout/Brand'
import { ChangeText } from '../components/ui/Change'
import { EvidenceMeter } from '../components/ui/EvidenceMeter'
import { LensMark } from '../components/ui/LensMark'
import { StatementTag } from '../components/ui/StatementTag'
import { getStock } from '../data/stocks'
import type { Familiarity, Goal } from '../data/types'
import { useApp } from '../state/AppState'
import { FAMILIARITY_OPTIONS, GOAL_OPTIONS } from './onboardingOptions'

/** SCREEN 1 — Welcome + two-question onboarding. No financial profile, no risk questionnaire. */
export function OnboardingPage() {
  const { prefs, completeOnboarding } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [familiarity, setFamiliarity] = useState<Familiarity | null>(null)
  const [goals, setGoals] = useState<Goal[]>([])

  if (prefs.onboarded && step === 0) return <Navigate to="/" replace />

  const finish = (f: Familiarity = familiarity ?? 'basics', g: Goal[] = goals) => {
    completeOnboarding(f, g)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-dvh bg-white lg:grid lg:place-items-center lg:bg-canvas lg:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pb-6 pt-4 lg:min-h-0 lg:rounded-3xl lg:border lg:border-line lg:bg-white lg:px-8 lg:pb-8 lg:pt-6 lg:shadow-sm">
        <div className="flex h-10 items-center justify-between">
          {step === 0 ? (
            <Brand />
          ) : (
            <button onClick={() => setStep(step - 1)} className="-ml-2 rounded-full p-2 hover:bg-subtle" aria-label="Back">
              <ArrowLeft className="size-5" />
            </button>
          )}
          {step > 0 ? (
            <div className="flex items-center gap-3">
              <span className="tnum text-xs font-medium text-ink-3">{step} of 2</span>
              <button onClick={() => finish()} className="text-sm font-medium text-ink-3 hover:text-ink">
                Skip
              </button>
            </div>
          ) : null}
        </div>

        {step === 0 && <Welcome onStart={() => setStep(1)} />}

        {step === 1 && (
          <Question
            title="How familiar are you with investing?"
            note="This sets how Lens explains things. You can change it anytime."
            canContinue={!!familiarity}
            onContinue={() => setStep(2)}
          >
            <div role="radiogroup" aria-label="Investing experience" className="space-y-3">
              {FAMILIARITY_OPTIONS.map((o) => {
                const on = familiarity === o.value
                return (
                  <button
                    key={o.value}
                    role="radio"
                    aria-checked={on}
                    onClick={() => setFamiliarity(o.value)}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition-colors ${
                      on ? 'border-ink bg-subtle/60 ring-1 ring-ink' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] font-semibold">{o.label}</span>
                      <span className="mt-0.5 block text-sm text-ink-3">{o.hint}</span>
                    </span>
                    <span className={`grid size-5 shrink-0 place-items-center rounded-full border-2 ${on ? 'border-ink bg-ink' : 'border-line-strong'}`}>
                      {on && <span className="size-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                )
              })}
            </div>
          </Question>
        )}

        {step === 2 && (
          <Question
            title="What would you like Groww to help you with?"
            note="Pick any. We only use this to adjust how detailed explanations are — never to recommend investments."
            canContinue
            cta={goals.length ? 'Continue' : 'Continue without choosing'}
            onContinue={() => finish()}
          >
            <div className="grid grid-cols-2 gap-3">
              {GOAL_OPTIONS.map((g) => {
                const on = goals.includes(g.value)
                return (
                  <button
                    key={g.value}
                    aria-pressed={on}
                    onClick={() => setGoals(on ? goals.filter((x) => x !== g.value) : [...goals, g.value])}
                    className={`relative flex min-h-24 flex-col justify-end rounded-2xl border p-4 text-left text-[15px] font-semibold transition-colors ${
                      on ? 'border-ink bg-subtle/60 ring-1 ring-ink' : 'border-line hover:border-line-strong'
                    }`}
                  >
                    {on && (
                      <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-ink text-white">
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                    )}
                    {g.label}
                  </button>
                )
              })}
            </div>
          </Question>
        )}
      </div>
    </div>
  )
}

function Question({
  title,
  note,
  children,
  canContinue,
  onContinue,
  cta = 'Continue',
}: {
  title: string
  note: string
  children: ReactNode
  canContinue: boolean
  onContinue: () => void
  cta?: string
}) {
  return (
    <div className="flex flex-1 animate-fade-up flex-col">
      <h1 className="mt-6 text-[26px] font-semibold leading-tight tracking-tight">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{note}</p>
      <div className="mt-6">{children}</div>
      <div className="mt-auto pt-8">
        <button
          onClick={onContinue}
          disabled={!canContinue}
          className="w-full rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-white transition-opacity disabled:opacity-30"
        >
          {cta}
        </button>
      </div>
    </div>
  )
}

function Welcome({ onStart }: { onStart: () => void }) {
  const hdfc = getStock('hdfc-bank')!
  return (
    <div className="flex flex-1 animate-fade-up flex-col">
      {/* A real preview of Lens, rendered from the same data */}
      <div className="mt-6 rounded-3xl border border-line bg-canvas p-3" aria-hidden="true">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-lens-ink">
              <LensMark className="size-3.5" /> Lens · {hdfc.name}
            </span>
            <ChangeText value={hdfc.dailyChange} className="text-sm" suffix="today" />
          </div>
          <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-3">Why is it moving?</div>
          <div className="mt-1 text-[15px] font-semibold">{hdfc.whyMoving.headline}</div>
          <ul className="mt-3 space-y-2.5">
            {hdfc.whyMoving.drivers.slice(0, 2).map((d) => (
              <li key={d.id} className="rounded-xl border border-line px-3 py-2.5">
                <div className="text-sm font-medium">{d.title}</div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2">
                  <StatementTag kind="interpretation" />
                  <EvidenceMeter strength={d.evidence} />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-2.5 flex items-start gap-2 rounded-xl border border-dashed border-caution/40 bg-caution-soft/60 px-3 py-2">
            <StatementTag kind="uncertainty" />
            <span className="text-xs leading-relaxed text-ink-2">These are likely factors, not proven causes.</span>
          </div>
        </div>
      </div>

      <div className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-lens-ink">
        <LensMark className="size-4" /> Introducing Groww Lens
      </div>
      <h1 className="mt-2 text-[30px] font-semibold leading-[1.15] tracking-tight">Understand before you invest.</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">
        See a stock moving and not sure why? Lens explains what’s driving it, what changed, how the sector did, and what the
        risks are — in plain language.
      </p>

      <div className="mt-auto pt-8">
        <button onClick={onStart} className="w-full rounded-2xl bg-ink py-3.5 text-[15px] font-semibold text-white">
          Get started
        </button>
        <p className="mt-3 text-center text-xs text-ink-3">Lens explains. It never tells you what to buy or sell.</p>
      </div>
    </div>
  )
}
