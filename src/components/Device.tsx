import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { useStore, type ScreenId, type SheetKind } from '../state/store'
import { fallPct } from '../lib/plan'
import { SCREEN_VIEWS } from '../screens'
import { SHEETS } from './sheets'
import { Mark } from './ui'

function StatusIcons() {
  return (
    <>
      <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" /><rect x="10" y="3" width="3" height="9" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" /></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true"><path d="M8 2.3c2.3 0 4.5.9 6.2 2.4l1.2-1.3A10.5 10.5 0 0 0 8 .5C5.2.5 2.6 1.6.6 3.4l1.2 1.3A8.8 8.8 0 0 1 8 2.3z" /><path d="M8 5.7c1.4 0 2.8.5 3.9 1.5l1.2-1.3A7.4 7.4 0 0 0 8 3.9c-1.9 0-3.7.7-5.1 2l1.2 1.3c1.1-1 2.5-1.5 3.9-1.5z" /><path d="M8 9c.6 0 1.1.2 1.5.5L8 11.2 6.5 9.5c.4-.3.9-.5 1.5-.5z" /></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" aria-hidden="true"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="20" height="9" rx="2" fill="currentColor" /><path d="M25 4.5v4c.8-.3 1.3-1.1 1.3-2s-.5-1.7-1.3-2z" fill="currentColor" opacity=".45" /></svg>
    </>
  )
}

/* Slides the incoming screen over the outgoing one; both stay mounted only while animating. */
function Viewport() {
  const { nav } = useStore()
  const [layers, setLayers] = useState<{ id: ScreenId; seq: number }[]>([{ id: nav.current, seq: nav.seq }])
  const els = useRef(new Map<number, HTMLElement>())

  useLayoutEffect(() => {
    setLayers(prev => {
      const top = prev[prev.length - 1]
      if (top.seq === nav.seq) return prev
      const next = { id: nav.current, seq: nav.seq }
      return nav.instant ? [next] : [top, next]
    })
  }, [nav])

  useLayoutEffect(() => {
    if (layers.length < 2) return
    const [out, inn] = layers
    const outEl = els.current.get(out.seq)
    const inEl = els.current.get(inn.seq)
    if (!outEl || !inEl) { setLayers([inn]); return }
    const fwd = nav.dir !== 'back'
    inEl.style.zIndex = fwd ? '2' : '1'
    outEl.style.zIndex = fwd ? '1' : '2'
    const opts: KeyframeAnimationOptions = { duration: 300, easing: 'cubic-bezier(.22,.8,.24,1)' }
    const a1 = inEl.animate([{ transform: `translateX(${fwd ? '100%' : '-28%'})` }, { transform: 'translateX(0)' }], opts)
    const a2 = outEl.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${fwd ? '-28%' : '100%'})` }], opts)
    a1.onfinish = () => setLayers(l => (l[l.length - 1].seq === inn.seq ? [inn] : l))
    return () => { a1.cancel(); a2.cancel(); inEl.style.zIndex = '' }
  }, [layers, nav.dir])

  return (
    <div className="viewport" id="viewport">
      {layers.map((l, i) => {
        const View = SCREEN_VIEWS[l.id]
        const top = i === layers.length - 1
        return (
          <section key={l.seq} className="screen on" data-screen={l.id} data-top={top ? '1' : '0'} aria-hidden={!top}
            ref={el => { if (el) els.current.set(l.seq, el); else els.current.delete(l.seq) }}>
            <View />
          </section>
        )
      })}
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
    const f = document.querySelector('.screen[data-top="1"] .ftr') as HTMLElement | null
    ref.current.style.bottom = `${(f ? f.offsetHeight : 40) + 12}px`
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
    <div className={'sheet-wrap' + (open ? ' open' : '')} id="sheet">
      <div className="scrim" onClick={closeSheet} />
      <div className="sheet-panel" role="dialog" aria-modal="true" aria-labelledby="sheetTitle">
        <div className="grabber" />
        <Body />
      </div>
    </div>
  )
}

/* Month-3 lock screen; the notification opens the first-fall check-in. */
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
      <div className="lock-sb" aria-hidden="true"><StatusIcons /></div>
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
      <div className="lock-hint">Tap the notification to open it</div>
    </div>
  )
}

export function Device({ children }: { children?: ReactNode }) {
  const { lock } = useStore()
  return (
    <div id="device">
      <div className="phone" id="phone">
        <div className="statusbar" aria-hidden="true">
          <span>9:41</span>
          <span className="island" />
          <span className="sb-icons"><StatusIcons /></span>
        </div>
        <Viewport />
        <Toast />
        <SheetHost />
        <LockScreen />
        <div className={'home-ind' + (lock ? ' light' : '')} />
        {children}
      </div>
    </div>
  )
}
