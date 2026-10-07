import { enforcePolicy } from './safety'
import type { LensAnswer, LensProvider } from './types'

/**
 * Sketch of a production provider: POSTs the request to a Lens backend (LLM + retrieval over
 * filings, transcripts and market data) that returns the same `LensAnswer` shape.
 * The client-side policy check still runs on every response.
 *
 * Enable by setting VITE_LENS_ENDPOINT at build time. Not used in the prototype.
 */
export function createRemoteLensProvider(endpoint: string): LensProvider {
  return {
    name: 'remote',
    async ask(request) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: request.question,
          stockId: request.stockId,
          level: request.level,
          familiarity: request.familiarity,
          history: request.history.slice(-8),
        }),
      })
      if (!res.ok) throw new Error(`Lens backend error: ${res.status}`)
      return enforcePolicy((await res.json()) as LensAnswer)
    },
  }
}
