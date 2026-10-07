import { Search } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { DemoBadge } from '../ui/DemoBadge'
import { Brand } from './Brand'
import { NAV_ITEMS } from './navItems'

export function DesktopHeader() {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-30 hidden h-16 border-b border-line bg-white lg:block">
      <div className="mx-auto flex h-full max-w-6xl items-center gap-8 px-6">
        <Brand />
        <nav aria-label="Main">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-subtle text-ink' : 'text-ink-2 hover:text-ink'}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={() => navigate('/explore')}
            className="flex w-64 items-center gap-2 rounded-lg border border-line bg-canvas px-3 py-2 text-sm text-ink-3 hover:border-line-strong"
          >
            <Search className="size-4" aria-hidden="true" />
            Search stocks
          </button>
          <DemoBadge />
        </div>
      </div>
    </header>
  )
}
