import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { ExplainLevel, Familiarity, Goal } from '../data/types'
import { lensProvider, type ChatMessage } from '../lens'
import { readJSON, writeJSON } from '../lib/storage'

export interface Prefs {
  onboarded: boolean
  familiarity: Familiarity
  goals: Goal[]
  level: ExplainLevel
}

interface Persisted {
  prefs: Prefs
  watchlist: string[]
}

const STORAGE_KEY = 'groww-lens:v1'

const DEFAULTS: Persisted = {
  prefs: { onboarded: false, familiarity: 'basics', goals: [], level: 'standard' },
  watchlist: ['hdfc-bank', 'infosys'],
}

/** First-time investors get plain language by default; everyone can switch on the Lens screen. */
export function levelFor(familiarity: Familiarity): ExplainLevel {
  return familiarity === 'new' ? 'simple' : 'standard'
}

interface AppState {
  prefs: Prefs
  updatePrefs: (patch: Partial<Prefs>) => void
  completeOnboarding: (familiarity: Familiarity, goals: Goal[]) => void
  resetOnboarding: () => void
  /** Beginner helpers (term definitions, "why compare?" tips) are hidden for active investors. */
  showTips: boolean
  watchlist: string[]
  toggleWatch: (stockId: string) => void
  chats: Record<string, ChatMessage[]>
  pending: Record<string, boolean>
  ask: (stockId: string, question: string) => void
  clearChat: (stockId: string) => void
}

const Ctx = createContext<AppState | null>(null)

let idSeq = 0
const nextId = () => `m${Date.now().toString(36)}${(idSeq++).toString(36)}`

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(() => {
    const stored = readJSON<Persisted>(STORAGE_KEY, DEFAULTS)
    return { prefs: { ...DEFAULTS.prefs, ...stored.prefs }, watchlist: stored.watchlist ?? DEFAULTS.watchlist }
  })
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({})
  const [pending, setPending] = useState<Record<string, boolean>>({})
  const chatsRef = useRef(chats)
  chatsRef.current = chats

  useEffect(() => writeJSON(STORAGE_KEY, persisted), [persisted])

  const updatePrefs = useCallback(
    (patch: Partial<Prefs>) => setPersisted((p) => ({ ...p, prefs: { ...p.prefs, ...patch } })),
    [],
  )

  const completeOnboarding = useCallback(
    (familiarity: Familiarity, goals: Goal[]) =>
      setPersisted((p) => ({ ...p, prefs: { onboarded: true, familiarity, goals, level: levelFor(familiarity) } })),
    [],
  )

  const resetOnboarding = useCallback(() => {
    setPersisted((p) => ({ ...p, prefs: { ...DEFAULTS.prefs } }))
    setChats({})
  }, [])

  const toggleWatch = useCallback(
    (id: string) =>
      setPersisted((p) => ({
        ...p,
        watchlist: p.watchlist.includes(id) ? p.watchlist.filter((x) => x !== id) : [...p.watchlist, id],
      })),
    [],
  )

  const ask = useCallback(
    (stockId: string, question: string) => {
      const q = question.trim()
      if (!q) return
      const userMsg: ChatMessage = { id: nextId(), role: 'user', text: q }
      const history = chatsRef.current[stockId] ?? []
      setChats((c) => ({ ...c, [stockId]: [...(c[stockId] ?? []), userMsg] }))
      setPending((p) => ({ ...p, [stockId]: true }))
      const { level, familiarity } = persisted.prefs
      const append = (msg: ChatMessage) => setChats((c) => ({ ...c, [stockId]: [...(c[stockId] ?? []), msg] }))
      lensProvider
        .ask({ question: q, stockId, level, familiarity, history })
        .then((answer) => append({ id: nextId(), role: 'lens', answer }))
        .catch(() =>
          append({
            id: nextId(),
            role: 'lens',
            answer: {
              intent: 'fallback',
              lead: 'Something went wrong while answering. Please try again.',
              blocks: [],
              sources: [],
              followUps: [],
            },
          }),
        )
        .finally(() => setPending((p) => ({ ...p, [stockId]: false })))
    },
    [persisted.prefs],
  )

  const clearChat = useCallback((stockId: string) => setChats((c) => ({ ...c, [stockId]: [] })), [])

  const value = useMemo<AppState>(
    () => ({
      prefs: persisted.prefs,
      updatePrefs,
      completeOnboarding,
      resetOnboarding,
      showTips: persisted.prefs.familiarity !== 'active',
      watchlist: persisted.watchlist,
      toggleWatch,
      chats,
      pending,
      ask,
      clearChat,
    }),
    [persisted, updatePrefs, completeOnboarding, resetOnboarding, toggleWatch, chats, pending, ask, clearChat],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppStateProvider')
  return ctx
}
