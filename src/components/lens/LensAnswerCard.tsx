import { ShieldCheck, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AnswerBlock, GuardrailKind, LensAnswer } from '../../lens'
import { GlossaryText } from '../ui/GlossaryText'
import { LensMark } from '../ui/LensMark'
import { StatementTag, STATEMENT_BORDER } from '../ui/StatementTag'

const GUARDRAIL_LABEL: Record<GuardrailKind, string> = {
  advice: 'Lens doesn’t give buy or sell calls',
  'stock-picking': 'Lens doesn’t pick stocks',
  prediction: 'Lens doesn’t predict prices',
  'target-price': 'Lens doesn’t set price targets',
  guarantee: 'No return can be guaranteed',
  'out-of-scope': 'Outside what Lens covers',
}

function Items({ block }: { block: AnswerBlock }) {
  const rich = block.items.some((i) => i.title || i.meta)
  if (!rich && block.items.length === 1) {
    return (
      <p className="text-[15px] leading-relaxed text-ink">
        <GlossaryText text={block.items[0].text} limit={1} />
      </p>
    )
  }
  return (
    <ul className={rich ? 'space-y-3' : 'space-y-1.5'}>
      {block.items.map((item, i) => (
        <li key={i} className={rich ? '' : 'flex gap-2 text-[15px] leading-relaxed text-ink'}>
          {rich ? (
            <>
              {item.title && <div className="text-sm font-semibold text-ink">{item.title}</div>}
              <div className="text-[15px] leading-relaxed text-ink-2">
                <GlossaryText text={item.text} limit={1} />
              </div>
              {item.meta && <div className="mt-0.5 text-xs text-ink-3">{item.meta}</div>}
            </>
          ) : (
            <>
              <span className="mt-[9px] size-1 shrink-0 rounded-full bg-ink-3" aria-hidden="true" />
              <span>
                <GlossaryText text={item.text} limit={1} />
              </span>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

function Block({ block }: { block: AnswerBlock }) {
  if (block.kind === 'risk') {
    return (
      <ul className="space-y-3">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-2.5">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-caution" aria-hidden="true" />
            <div>
              <div className="text-sm font-semibold">
                {item.title}
                {item.meta && <span className="ml-2 text-[11px] font-medium uppercase tracking-wide text-ink-3">{item.meta}</span>}
              </div>
              <div className="text-[15px] leading-relaxed text-ink-2">{item.text}</div>
            </div>
          </li>
        ))}
      </ul>
    )
  }
  if (block.kind === 'list') {
    return (
      <div>
        {block.title && <div className="mb-2 text-[13px] font-semibold text-ink-2">{block.title}</div>}
        <Items block={block} />
      </div>
    )
  }
  return (
    <div className={`border-l-2 pl-3 ${STATEMENT_BORDER[block.kind]}`}>
      <div className="mb-1.5 flex items-center gap-2">
        <StatementTag kind={block.kind} />
        {block.title && <span className="text-xs font-medium text-ink-3">{block.title}</span>}
      </div>
      <Items block={block} />
    </div>
  )
}

export function LensAnswerCard({ answer, onFollowUp }: { answer: LensAnswer; onFollowUp: (q: string) => void }) {
  return (
    <article className="animate-fade-up">
      <div className="flex items-center gap-1.5 text-xs font-medium text-ink-3">
        <LensMark className="size-3.5 text-lens" />
        Lens
        {answer.note && <span>· {answer.note}</span>}
      </div>
      {answer.guardrail && (
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-subtle px-2 py-1 text-xs font-medium text-ink-2">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          {GUARDRAIL_LABEL[answer.guardrail]}
        </div>
      )}
      <p className="mt-2 text-[16px] font-medium leading-relaxed text-ink">{answer.lead}</p>

      {answer.plain && (
        <div className="mt-3 rounded-xl bg-lens-soft px-3.5 py-3">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-lens-ink">In plain words</div>
          <p className="mt-1 text-[15px] leading-relaxed text-ink">{answer.plain}</p>
        </div>
      )}

      {answer.blocks.length > 0 && (
        <div className="mt-4 space-y-4">
          {answer.blocks.map((b, i) => (
            <Block key={i} block={b} />
          ))}
        </div>
      )}

      {answer.sources.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-ink-3">Based on</span>
          {answer.sources.map((s) =>
            s.kind === 'event' && s.stockId ? (
              <Link
                key={s.id}
                to={`/stock/${s.stockId}/lens/timeline?event=${s.id}`}
                className="rounded-md border border-line px-1.5 py-0.5 text-xs text-ink-2 hover:border-lens/40 hover:text-lens-ink"
              >
                {s.label}
              </Link>
            ) : (
              <span key={s.id} className="rounded-md bg-subtle px-1.5 py-0.5 text-xs text-ink-2">
                {s.label}
              </span>
            ),
          )}
        </div>
      )}

      {answer.footnote && <p className="mt-3 text-xs leading-relaxed text-ink-3">{answer.footnote}</p>}

      {answer.followUps.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {answer.followUps.map((f) => (
            <button
              key={f}
              onClick={() => onFollowUp(f)}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-left text-[13px] font-medium text-ink-2 transition-colors hover:border-lens/40 hover:text-lens-ink"
            >
              {f}
            </button>
          ))}
        </div>
      )}
    </article>
  )
}
