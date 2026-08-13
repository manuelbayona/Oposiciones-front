import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateResult } from './CandidateResult'

describe('CandidateResult', () => {
  it('renders the opposition score, merits, final score and position', () => {
    render(
      <CandidateResult
        result={{
          oppositionScore: 8.75,
          meritsScore: 7.2,
          finalScore: 8.13,
          position: 5,
          hasPosition: null,
        }}
      />,
    )

    expect(screen.getByText('8,75')).toBeInTheDocument()
    expect(screen.getByText('8,13')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.queryByText('Plaza obtenida')).not.toBeInTheDocument()
  })

  it('shows "Sí" or "No" for placement only when the information is known', () => {
    render(
      <CandidateResult
        result={{
          oppositionScore: null,
          meritsScore: null,
          finalScore: null,
          position: null,
          hasPosition: true,
        }}
      />,
    )

    expect(screen.getByText('Plaza obtenida')).toBeInTheDocument()
    expect(screen.getByText('Sí')).toBeInTheDocument()
  })
})
