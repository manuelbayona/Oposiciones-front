import { describe, expect, it } from 'vitest'
import { nextSort, parseSort, serializeSort } from './sort'

describe('parseSort', () => {
  it('parses a valid "key,direction" sort param', () => {
    expect(parseSort('finalScore,desc')).toEqual({ key: 'finalScore', direction: 'desc' })
  })

  it('returns null for an absent or malformed param', () => {
    expect(parseSort(null)).toBeNull()
    expect(parseSort('')).toBeNull()
    expect(parseSort('finalScore')).toBeNull()
    expect(parseSort('finalScore,sideways')).toBeNull()
  })
})

describe('serializeSort', () => {
  it('serializes a sort back to its URL representation', () => {
    expect(serializeSort({ key: 'finalScore', direction: 'asc' })).toBe('finalScore,asc')
  })

  it('returns undefined for no active sort', () => {
    expect(serializeSort(null)).toBeUndefined()
  })
})

describe('nextSort', () => {
  it('starts a new column at ascending', () => {
    expect(nextSort(null, 'finalScore')).toEqual({ key: 'finalScore', direction: 'asc' })
  })

  it('cycles the same column from ascending to descending', () => {
    const current = { key: 'finalScore', direction: 'asc' as const }
    expect(nextSort(current, 'finalScore')).toEqual({ key: 'finalScore', direction: 'desc' })
  })

  it('cycles the same column from descending back to none', () => {
    const current = { key: 'finalScore', direction: 'desc' as const }
    expect(nextSort(current, 'finalScore')).toBeNull()
  })

  it('switches to ascending when a different column is clicked', () => {
    const current = { key: 'finalScore', direction: 'desc' as const }
    expect(nextSort(current, 'meritsScore')).toEqual({ key: 'meritsScore', direction: 'asc' })
  })
})
