import type { Stock } from '../types'
import { hdfcBank } from './hdfc-bank'
import { iciciBank } from './icici-bank'
import { reliance } from './reliance'
import { tataMotors } from './tata-motors'
import { infosys } from './infosys'

/** The seeded stock universe for the prototype. */
export const STOCKS: Stock[] = [hdfcBank, reliance, tataMotors, infosys, iciciBank]

const byId = new Map(STOCKS.map((s) => [s.id, s]))

export function getStock(id: string | undefined): Stock | undefined {
  return id ? byId.get(id) : undefined
}

/** Names and aliases used to recognise a stock mentioned in a question. */
export const STOCK_ALIASES: Record<string, string[]> = {
  'hdfc-bank': ['hdfc bank', 'hdfcbank', 'hdfc'],
  'icici-bank': ['icici bank', 'icicibank', 'icici'],
  reliance: ['reliance industries', 'reliance', 'ril', 'jio'],
  'tata-motors': ['tata motors', 'tatamotors', 'tata motor', 'tata'],
  infosys: ['infosys', 'infy'],
}
