import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useBack } from '../../hooks/useBack'

/** Sub-page header: back button, title, optional actions. Sits under the desktop header on large screens. */
export function TopBar({
  title,
  subtitle,
  back,
  right,
  border = true,
}: {
  title?: ReactNode
  subtitle?: ReactNode
  back: string
  right?: ReactNode
  border?: boolean
}) {
  const goBack = useBack(back)
  return (
    <div className={`sticky top-0 z-20 bg-white lg:top-16 ${border ? 'border-b border-line' : ''}`}>
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-2 lg:px-6">
        <button onClick={goBack} className="rounded-full p-2 text-ink hover:bg-subtle lg:-ml-2" aria-label="Back">
          <ArrowLeft className="size-5" />
        </button>
        <div className="min-w-0 flex-1">
          {title && <div className="truncate text-[15px] font-semibold leading-tight">{title}</div>}
          {subtitle && <div className="truncate text-xs text-ink-3">{subtitle}</div>}
        </div>
        {right && <div className="flex items-center gap-1 pr-1">{right}</div>}
      </div>
    </div>
  )
}
