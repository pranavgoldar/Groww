import { composeAnswer } from './compose'
import { enforcePolicy } from './safety'
import type { LensProvider } from './types'

/**
 * Deterministic provider used by the prototype. A short, variable delay keeps the interaction
 * feeling like a real request without slowing the demo down.
 */
export const mockLensProvider: LensProvider = {
  name: 'mock',
  async ask(request) {
    const answer = enforcePolicy(composeAnswer(request))
    await new Promise((resolve) => setTimeout(resolve, 450 + Math.min(request.question.length * 6, 350)))
    return answer
  },
}
