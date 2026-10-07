import { useNavigate } from 'react-router-dom'
import type { Stock } from '../../data/types'
import { classifyMovement } from '../../lib/movement'
import { ChangeText } from '../ui/Change'
import { LensMark } from '../ui/LensMark'
import { Sheet } from '../ui/Sheet'

/**
 * Order execution is out of scope. Instead, the sheet shows how Lens would surface a short
 * recap at the moment of decision — without nudging the user either way.
 */
export function OrderSheet({ stock, side, onClose }: { stock: Stock; side: 'buy' | 'sell' | null; onClose: () => void }) {
  const navigate = useNavigate()
  const verdict = classifyMovement(stock)
  const risk = stock.risks[0]
  return (
    <Sheet open={side !== null} onClose={onClose} title="Orders are off in this prototype">
      <p className="text-sm leading-relaxed text-ink-2">
        In the full app, this would open the {side === 'sell' ? 'sell' : 'buy'} screen. Lens would show a quick recap first —
        the decision is always yours.
      </p>
      <div className="mt-4 rounded-xl border border-line p-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-lens-ink">
          <LensMark className="size-3.5" /> Before you decide
        </div>
        <dl className="mt-3 space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-ink-3">Today</dt>
            <dd className="text-right">
              <ChangeText value={stock.dailyChange} /> <span className="text-ink-2">· {verdict.label}</span>
            </dd>
          </div>
          <div>
            <dt className="text-ink-3">A risk to weigh</dt>
            <dd className="mt-0.5 font-medium">{risk.title}</dd>
          </div>
        </dl>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button onClick={onClose} className="rounded-xl border border-line py-3 text-sm font-semibold text-ink hover:bg-subtle">
          Close
        </button>
        <button
          onClick={() => {
            onClose()
            navigate(`/stock/${stock.id}/lens`)
          }}
          className="rounded-xl bg-lens py-3 text-sm font-semibold text-white hover:bg-lens-ink"
        >
          Open Lens
        </button>
      </div>
    </Sheet>
  )
}
