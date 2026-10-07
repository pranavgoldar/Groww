import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from './navItems'

/** Mobile bottom navigation. Lens is intentionally not here — it lives inside stock pages. */
export function BottomNav() {
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 backdrop-blur pb-safe lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${isActive ? 'text-ink' : 'text-ink-3'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="size-[22px]" strokeWidth={isActive ? 2.2 : 1.7} aria-hidden="true" />
                  {label}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
