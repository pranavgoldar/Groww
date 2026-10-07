import { ChartPie, Compass, House, UserRound, type LucideIcon } from 'lucide-react'

export const NAV_ITEMS: Array<{ to: string; label: string; icon: LucideIcon }> = [
  { to: '/', label: 'Home', icon: House },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/portfolio', label: 'Portfolio', icon: ChartPie },
  { to: '/profile', label: 'Profile', icon: UserRound },
]
