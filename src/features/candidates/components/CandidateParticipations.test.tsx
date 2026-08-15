import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateParticipations } from './CandidateParticipations'
import type { ParticipationItem } from '../model/candidate'

describe('CandidateParticipations', () => {
  it('shows a placeholder when there are no participations', () => {
    render(<CandidateParticipations participations={[]} />)

    expect(screen.getByText('Convocatorias')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders each participation with its merit score', () => {
    const participations: ParticipationItem[] = [
      {
        convocationYear: 2026,
        convocationCode: 'OPOPRI26',
        body: 'MAESTROS',
        specialty: 'EDUCACIÓN INFANTIL',
        tribunalNumber: '25',
        totalMeritScore: 7.25,
      },
    ]

    render(<CandidateParticipations participations={participations} />)

    expect(screen.getByText('OPOPRI26 · MAESTROS')).toBeInTheDocument()
    expect(screen.getByText('EDUCACIÓN INFANTIL · Tribunal 25')).toBeInTheDocument()
    expect(screen.getByText('7,25')).toBeInTheDocument()
  })

  it('falls back to the convocation year when there is no real convocation code', () => {
    const participations: ParticipationItem[] = [
      {
        convocationYear: 2026,
        convocationCode: null,
        body: 'MAESTROS',
        specialty: 'EDUCACIÓN INFANTIL',
        tribunalNumber: '25',
        totalMeritScore: null,
      },
    ]

    render(<CandidateParticipations participations={participations} />)

    expect(screen.getByText('2026 · MAESTROS')).toBeInTheDocument()
  })
})
