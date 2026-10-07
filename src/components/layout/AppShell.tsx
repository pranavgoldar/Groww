import { useLayoutEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../state/AppState'
import { BottomNav } from './BottomNav'
import { DesktopHeader } from './DesktopHeader'

const TAB_PATHS = ['/', '/explore', '/portfolio', '/profile']

export function AppShell() {
  const { prefs } = useApp()
  const { pathname } = useLocation()
  const isTab = TAB_PATHS.includes(pathname)

  // Layout effect so it runs before child effects that scroll to a specific item.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  if (!prefs.onboarded) return <Navigate to="/welcome" replace />

  return (
    <div className="min-h-dvh">
      <DesktopHeader />
      <div className={isTab ? 'pb-20 lg:pb-0' : ''}>
        <Outlet />
      </div>
      {isTab && <BottomNav />}
    </div>
  )
}
