import { describe, expect, it } from 'vitest'
import { formatDate, formatPosition, formatScore } from './format'

describe('formatScore', () => {
  it('formats a number using Spanish decimal comma notation', () => {
    expect(formatScore(8.7)).toBe('8,70')
    expect(formatScore(10)).toBe('10,00')
  })

  it('renders missing values as an em dash instead of zero', () => {
    expect(formatScore(null)).toBe('—')
    expect(formatScore(undefined)).toBe('—')
  })

  it('does not confuse a real zero score with a missing value', () => {
    expect(formatScore(0)).toBe('0,00')
  })
})

describe('formatPosition', () => {
  it('formats a position as a plain integer string', () => {
    expect(formatPosition(5)).toBe('5')
  })

  it('renders missing positions as an em dash', () => {
    expect(formatPosition(null)).toBe('—')
    expect(formatPosition(undefined)).toBe('—')
  })
})

describe('formatDate', () => {
  it('formats an ISO date using Spanish day/month/year order', () => {
    expect(formatDate('2026-06-20')).toBe('20/06/2026')
  })

  it('renders missing or invalid dates as an em dash', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('not-a-date')).toBe('—')
  })
})
