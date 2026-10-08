import { useLayoutEffect } from 'react'
import { StoreProvider, SCREENS, useStore } from './state/store'
import { Device } from './components/Device'

const DEVICE_W = 414
const DEVICE_H = 868

/* Scale the device down when the window is too small to show it with the switcher. */
function useFitDevice() {
  useLayoutEffect(() => {
    const fit = () => {
      const device = document.getElementById('device')
      const wrap = document.getElementById('deviceWrap')
      const below = document.getElementById('below')
      if (!device || !wrap || !below) return
      const availH = window.innerHeight - below.offsetHeight - 48
      const availW = window.innerWidth - 24
      const s = Math.max(0.5, Math.min(1, availH / DEVICE_H, availW / DEVICE_W))
      device.style.transform = s < 1 ? `scale(${s})` : ''
      wrap.style.width = `${DEVICE_W * s}px`
      wrap.style.height = `${DEVICE_H * s}px`
    }
    fit()
    window.addEventListener('resize', fit)
    document.fonts?.ready.then(fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
}

function Switcher() {
  const { nav, jump, reset } = useStore()
  const chip = (s: (typeof SCREENS)[number]) => (
    <button key={s.id} className={'sw' + (s.main ? '' : ' support')} data-screen={s.id}
      aria-current={nav.current === s.id} onClick={() => jump(s.id)}>
      {s.main && <span className={'n' + (s.n ? '' : ' dot')}>{s.n ?? ''}</span>}
      {s.label}
    </button>
  )
  return (
    <div id="below">
      <nav className="switcher" aria-label="Jump to a screen">
        <div className="sw-group" id="swMain"><span className="sw-label">Main screens</span>{SCREENS.filter(s => s.main).map(chip)}</div>
        <div className="sw-group" id="swSupport"><span className="sw-label">Supporting</span>{SCREENS.filter(s => !s.main).map(chip)}</div>
      </nav>
      <div className="below-foot">
        <span>Money Plan prototype · Riya, 22, plans ₹15,000 a month</span>
        <button className="reset" onClick={reset}>Reset prototype</button>
      </div>
    </div>
  )
}

function Stage() {
  useFitDevice()
  return (
    <div className="stage">
      <div id="deviceWrap"><Device /></div>
      <Switcher />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Stage />
    </StoreProvider>
  )
}
