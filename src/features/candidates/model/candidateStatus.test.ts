import { describe, expect, it } from 'vitest'
import { candidateStatusLabel, isCandidateStatusEvaluated } from './candidateStatus'

describe('candidateStatusLabel', () => {
  it('translates each status to its Spanish label', () => {
    expect(candidateStatusLabel('EVALUATED')).toBe('Evaluado')
    expect(candidateStatusLabel('NOT_PRESENTED')).toBe('No presentado')
    expect(candidateStatusLabel('EXCLUDED')).toBe('Excluido')
  })
})

describe('isCandidateStatusEvaluated', () => {
  it('is true only for the evaluated status', () => {
    expect(isCandidateStatusEvaluated('EVALUATED')).toBe(true)
    expect(isCandidateStatusEvaluated('PENDING')).toBe(false)
  })
})
