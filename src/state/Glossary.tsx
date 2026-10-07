import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { getGlossaryEntry, type GlossaryEntry } from '../data/glossary'
import { Sheet } from '../components/ui/Sheet'

const Ctx = createContext<(id: string) => void>(() => {})

/** One shared definition sheet for every tappable term in the app. */
export function GlossaryProvider({ children }: { children: ReactNode }) {
  const [entry, setEntry] = useState<GlossaryEntry | null>(null)
  const open = useCallback((id: string) => setEntry(getGlossaryEntry(id) ?? null), [])
  const close = useCallback(() => setEntry(null), [])
  return (
    <Ctx.Provider value={open}>
      {children}
      <Sheet open={!!entry} onClose={close} title={entry?.term ?? ''}>
        <p className="text-[15px] leading-relaxed text-ink-2">{entry?.definition}</p>
        <button onClick={close} className="mt-5 w-full rounded-xl bg-ink py-3 text-sm font-semibold text-white">
          Got it
        </button>
      </Sheet>
    </Ctx.Provider>
  )
}

export function useGlossary() {
  return useContext(Ctx)
}
