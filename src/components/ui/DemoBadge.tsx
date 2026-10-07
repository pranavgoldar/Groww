/** Unobtrusive reminder that nothing in the prototype is live market data. */
export function DemoBadge({ className = '' }: { className?: string }) {
  // Display utilities (hidden / lg:inline-flex) go on the wrapper so they never fight the badge's own layout.
  return (
    <span className={className}>
      <span
        className="inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-ink-3"
        title="All prices, events and figures are illustrative sample data for this prototype."
      >
        <span className="size-1.5 rounded-full bg-ink-3/60" aria-hidden="true" />
        Demo data · Not real-time
      </span>
    </span>
  )
}
