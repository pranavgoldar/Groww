import type { BucketKey } from './plan'

/** Sample products for the prototype. Generic names only: Money Plan never recommends a specific fund or stock. */
export type ProductId = 'largecap' | 'flexicap' | 'hybrid' | 'liquid' | 'shortdur' | 'stock'
export type Placeable = Exclude<BucketKey, 'keep'>
/** Which part of the plan a purchase counts toward, or none of it. */
export type Toward = Placeable | 'outside'

export interface Product {
  av: string
  name: string
  short: string // "index fund", used in "your index fund SIP"
  kind: string
  sip: boolean // monthly SIP, or a one-time buy
  bucket: Placeable // where it counts by default
}

export const PRODUCTS: Record<ProductId, Product> = {
  largecap: { av: 'LC', name: 'Large-cap index fund (sample)', short: 'index fund', kind: 'Index fund · Large-cap · Sample for this prototype', sip: true, bucket: 'grow' },
  flexicap: { av: 'FC', name: 'Flexi-cap fund (sample)', short: 'flexi-cap fund', kind: 'Equity fund · Flexi-cap · Sample for this prototype', sip: true, bucket: 'grow' },
  hybrid: { av: 'HY', name: 'Hybrid fund (sample)', short: 'hybrid fund', kind: 'Hybrid fund · Shares and bonds · Sample for this prototype', sip: true, bucket: 'grow' },
  liquid: { av: 'LQ', name: 'Liquid fund (sample)', short: 'liquid fund', kind: 'Debt fund · Liquid · Sample for this prototype', sip: true, bucket: 'park' },
  shortdur: { av: 'SD', name: 'Short-duration fund (sample)', short: 'short-duration fund', kind: 'Debt fund · Short duration · Sample for this prototype', sip: true, bucket: 'park' },
  stock: { av: 'SC', name: 'Sample Company (sample stock)', short: 'stock', kind: 'Share of a single company · Sample for this prototype', sip: false, bucket: 'learn' },
}

/** Why a product counts where it does by default. */
export const AUTO_WHY: Record<Placeable, string> = {
  grow: 'Funds that hold shares count toward Grow.',
  park: 'Liquid and short-duration funds count toward Park.',
  learn: 'Single stocks count toward Invest in stocks.',
}

/** A purchase other than the plan's own two SIPs (index fund for Grow, liquid fund for Park). */
export interface Purchase {
  id: number
  product: ProductId
  amt: number
  toward: Toward
}
