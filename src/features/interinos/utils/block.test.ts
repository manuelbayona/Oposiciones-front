import { describe, expect, it } from 'vitest'
import { formatBlock } from './block'

describe('formatBlock', () => {
  it('translates known block codes to a readable label', () => {
    expect(formatBlock('bloque_i')).toBe('Bloque I')
    expect(formatBlock('bloque_ii')).toBe('Bloque II')
  })

  it('falls back to the raw value for an unknown block', () => {
    expect(formatBlock('bloque_iii')).toBe('bloque_iii')
  })
})
