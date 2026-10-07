/** The Lens mark: a simple aperture. Deliberately plain — no sparkles, no "AI magic". */
export function LensMark({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="7.25" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="10" cy="10" r="2.6" fill="currentColor" />
    </svg>
  )
}
