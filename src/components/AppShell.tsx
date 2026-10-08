import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useStore, type SheetKind } from '../state/store'
import { fallPct } from '../lib/plan'
import { SCREEN_VIEWS } from '../screens'
import { SHEETS } from './sheets'
import { Mark } from './ui'

/* Groww-style top bar, shown on laptop-sized windows. Phones get each screen's own app bar instead. */
function TopNav() {
  const { s, nav, go, sheet, openSheet } = useStore()
  const planHome = s.ff ? 'portfolio' : s.added ? 'categories' : 'start'
  const onExplore = nav.current === 'explore'
  return (
    <nav className="topnav" aria-label="Groww">
      <div className="topnav-in">
        <button className="topnav-logo" aria-label="Money Plan home" onClick={() => go(planHome)}><Mark size={36} /></button>
        <div className="topnav-links">
          <button className={onExplore ? '' : 'on'} aria-current={!onExplore} onClick={() => go(planHome)}>Money Plan</button>
          <button className={onExplore ? 'on' : ''} aria-current={onExplore} onClick={() => go('explore')}>Explore</button>
        </div>
        <button className="topnav-avatar" aria-label="Your account" aria-haspopup="dialog" aria-expanded={sheet === 'account'} onClick={() => openSheet('account')}>R</button>
      </div>
    </nav>
  )
}

/* The current screen. Navigation swaps it, scrolls to the top and fades it in. */
function Viewport() {
  const { nav } = useStore()
  const View = SCREEN_VIEWS[nav.current]
  useLayoutEffect(() => { window.scrollTo(0, 0) }, [nav.seq])
  return (
    <div className="viewport" id="viewport">
      <section key={nav.seq} className="screen on" data-screen={nav.current} data-top="1">
        <View />
      </section>
    </div>
  )
}

function Toast() {
  const { toast } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const [msg, setMsg] = useState('')
  useLayoutEffect(() => {
    if (!toast || !ref.current) return
    setMsg(toast.msg)
    // On phones the main button bar is pinned to the bottom; sit above it.
    const f = document.querySelector('.screen[data-top="1"] .ftr') as HTMLElement | null
    const pinned = f && getComputedStyle(f.parentElement as HTMLElement).position === 'sticky'
    ref.current.style.bottom = `${pinned && f ? f.offsetHeight + 12 : 24}px`
  }, [toast])
  return <div ref={ref} className={'toast' + (toast ? ' show' : '')} id="toast" role="status" aria-live="polite">{msg}</div>
}

function SheetHost() {
  const { sheet, closeSheet } = useStore()
  const [kind, setKind] = useState<SheetKind | null>(null)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (sheet) {
      setKind(sheet)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)))
      return () => cancelAnimationFrame(r)
    }
    setOpen(false)
    const t = window.setTimeout(() => setKind(null), 280)
    return () => window.clearTimeout(t)
  }, [sheet])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeSheet() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeSheet])
  if (!kind) return null
  const Body = SHEETS[kind]
  return (
    <div className={`sheet-wrap k-${kind}` + (open ? ' open' : '')} id="sheet">
      <div className="scrim" onClick={closeSheet} />
      <div className="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        <div className="grabber" />
        <Body />
      </div>
    </div>
  )
}

/* Time jump to month 3: a lock-screen moment whose notification opens the first-fall check-in. */
function LockScreen() {
  const { lock, setLock, set, d, replaceTail } = useStore()
  const [mounted, setMounted] = useState(false)
  const [shown, setShown] = useState(false)
  const [notifIn, setNotifIn] = useState(false)
  useEffect(() => {
    if (lock) {
      setMounted(true)
      const r = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
      const t = window.setTimeout(() => setNotifIn(true), 650)
      return () => { cancelAnimationFrame(r); window.clearTimeout(t) }
    }
    setShown(false)
    const t = window.setTimeout(() => { setMounted(false); setNotifIn(false) }, 360)
    return () => window.clearTimeout(t)
  }, [lock])
  if (!mounted) return null
  const open = () => {
    set({ ff: true })
    replaceTail([], ['checkin'], { instant: true })
    setLock(false)
  }
  return (
    <div className={'lock' + (shown ? ' show' : '') + (notifIn ? ' notif-in' : '')} id="lock">
      <div className="lock-time">
        <div className="lock-date">Thursday · month 3 of your plan</div>
        <div className="lock-clock">10:24</div>
      </div>
      <button className="notif" id="notif" onClick={open}>
        <span className="notif-ic" aria-hidden="true"><Mark size={26} /></span>
        <span className="notif-txt">
          <span className="notif-top"><span>groww</span><span>now</span></span>
          <b>Your index fund is down {fallPct(d.m3.indexPut)}%</b>
          <span>Here's what you decided when you invested.</span>
        </span>
      </button>
      <div className="lock-hint">Open the notification to continue</div>
    </div>
  )
}

export function AppShell() {
  return (
    <div className="app">
      <TopNav />
      <Viewport />
      <Toast />
      <SheetHost />
      <LockScreen />
    </div>
  )
}
