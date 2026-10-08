import { describe, expect, it } from 'vitest'
import { groupIN, inr, inrRange, oneDecimal, parseAmount } from './format'

describe('inr', () => {
  it('uses Indian digit grouping', () => {
    expect(inr(40000)).toBe('₹40,000')
    expect(inr(120000)).toBe('₹1,20,000')
    expect(inr(9100)).toBe('₹9,100')
    expect(inr(500)).toBe('₹500')
    expect(inr(1234567)).toBe('₹12,34,567')
    expect(inr(0)).toBe('₹0')
  })
  it('writes losses with a true minus sign', () => {
    expect(inr(-1000)).toBe('−₹1,000')
  })
  it('never relies on toLocaleString', () => {
    expect(groupIN.toString()).not.toMatch(/toLocaleString/)
  })
})

describe('inrRange', () => {
  it('writes ranges as ₹7,000–8,000', () => {
    expect(inrRange(7000, 8000)).toBe('₹7,000–8,000')
    expect(inrRange(3000, 3000)).toBe('₹3,000')
  })
})

describe('parseAmount', () => {
  it('keeps digits only', () => {
    expect(parseAmount('₹ 8,000')).toBe(8000)
    expect(parseAmount('')).toBe(0)
    expect(parseAmount('007')).toBe(7)
  })
})

it('oneDecimal', () => {
  expect(oneDecimal(18000 / 25000)).toBe('0.7')
})
