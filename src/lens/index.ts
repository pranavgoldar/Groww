import { mockLensProvider } from './mockProvider'
import { createRemoteLensProvider } from './remoteProvider'
import type { LensProvider } from './types'

const endpoint = import.meta.env.VITE_LENS_ENDPOINT as string | undefined

/** The single place the app gets answers from. Swap the mock for a real backend here. */
export const lensProvider: LensProvider = endpoint ? createRemoteLensProvider(endpoint) : mockLensProvider

export type { LensAnswer, LensRequest, ChatMessage, AnswerBlock, SourceRef, GuardrailKind } from './types'
