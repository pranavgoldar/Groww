import { Link } from 'react-router-dom'

export function Brand({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-semibold tracking-tight text-ink ${className}`} aria-label="Groww home">
      <span className="grid size-7 place-items-center rounded-lg bg-ink" aria-hidden="true">
        <svg viewBox="0 0 16 16" className="size-4" fill="none">
          <path d="M3 11.5 6.5 8l2.5 2.5L13 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[17px]">Groww</span>
    </Link>
  )
}
