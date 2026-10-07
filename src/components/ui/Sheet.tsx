import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

/** Bottom sheet on mobile, centred dialog on desktop. Escape and backdrop close it. */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button aria-label="Close" className="absolute inset-0 animate-fade-in bg-ink/35" onClick={onClose} tabIndex={-1} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative max-h-[85dvh] w-full animate-sheet-up overflow-y-auto rounded-t-2xl bg-white shadow-sheet outline-none pb-safe sm:max-w-md sm:rounded-2xl sm:shadow-pop"
      >
        <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-line-strong sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 px-5 pt-4">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} className="-mr-2 -mt-1 rounded-full p-2 text-ink-3 hover:bg-subtle" aria-label="Close">
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 pb-6 pt-2">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
