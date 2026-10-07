import { pct } from '../../lib/format'

function tone(value: number) {
  if (Math.abs(value) < 0.05) return 'text-ink-2'
  return value > 0 ? 'text-gain' : 'text-loss'
}

/** Percent change coloured by direction. The sign is always shown, so colour is never the only cue. */
export function ChangeText({ value, className = '', suffix }: { value: number; className?: string; suffix?: string }) {
  return (
    <span className={`tnum font-medium ${tone(value)} ${className}`}>
      {pct(value)}
      {suffix ? <span className="font-normal text-ink-3"> {suffix}</span> : null}
    </span>
  )
}

export function ChangePill({ value, className = '' }: { value: number; className?: string }) {
  const bg = Math.abs(value) < 0.05 ? 'bg-subtle' : value > 0 ? 'bg-gain-soft' : 'bg-loss-soft'
  return (
    <span className={`tnum inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-semibold ${bg} ${tone(value)} ${className}`}>
      {pct(value)}
    </span>
  )
}
