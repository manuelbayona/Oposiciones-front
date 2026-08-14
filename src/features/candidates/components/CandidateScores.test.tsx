import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateScores } from './CandidateScores'
import type { ScoreSection } from '../model/candidate'

const sections: ScoreSection[] = [
  {
    key: 'first',
    label: 'Primera prueba',
    items: [
      { key: 'partA', label: 'Parte A', value: 8.7 },
      { key: 'partB', label: 'Parte B', value: null },
    ],
    total: { key: 'firstTotal', label: 'Nota primera prueba', value: 8.9 },
  },
]

describe('CandidateScores', () => {
  it('renders each section with its items and total', () => {
    render(<CandidateScores sections={sections} />)
    expect(screen.getByText('Primera prueba')).toBeInTheDocument()
    expect(screen.getByText('Parte A')).toBeInTheDocument()
    expect(screen.getByText('8,70')).toBeInTheDocument()
    expect(screen.getByText('Nota primera prueba')).toBeInTheDocument()
    expect(screen.getByText('8,90')).toBeInTheDocument()
  })

  it('renders missing item values as a dash rather than zero', () => {
    render(<CandidateScores sections={sections} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders nothing when there are no sections', () => {
    const { container } = render(<CandidateScores sections={[]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
