import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateInterinosSection } from './CandidateInterinosSection'
import type { InterinosEntryItem } from '../model/interinos'

const teachingExperience = {
  b1: { rawValue: '1,2500', value: 1.25 },
  b2: { rawValue: '0,5000', value: 0.5 },
  b3: { rawValue: '0,0000', value: 0 },
  b4: { rawValue: '0,2500', value: 0.25 },
  total: { rawValue: '2,0000', value: 2 },
}

const bloqueIEntry: InterinosEntryItem = {
  listPosition: 26034300,
  overallRank: 3430,
  accreditedSpecialtyCodes: ['031'],
  block: 'bloque_i',
  teachingExperience,
  totalScore: { rawValue: '9,2900', value: 9.29 },
  highestPassedExamGrade: { rawValue: '7,2900', value: 7.29 },
  pointsFromPassedOppositionsSince2000: { rawValue: '2,0000', value: 2 },
  currentExamGrade: null,
  valid: true,
  extractorVersion: '0.1.0',
  processedAt: '2026-08-14T19:58:03.683998Z',
}

describe('CandidateInterinosSection', () => {
  it('shows a placeholder when the candidate has no interinos entries', () => {
    render(<CandidateInterinosSection entries={[]} specialtyLegend={undefined} />)

    expect(screen.getByText('Listado de interinos')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows bloque_i fields and hides currentExamGrade when it is null', () => {
    render(
      <CandidateInterinosSection
        entries={[bloqueIEntry]}
        specialtyLegend={{ '031': 'Educación infantil' }}
      />,
    )

    // Regression test: the raw listPosition (26034300, the document's internal reference code)
    // must never be shown as "Nº orden" - only the derived overallRank (the real position).
    expect(screen.getByText('Nº orden 3.430')).toBeInTheDocument()
    expect(screen.queryByText(/26034300/)).not.toBeInTheDocument()
    expect(screen.getByText('Bloque I')).toBeInTheDocument()
    expect(screen.getByText('Educación infantil')).toBeInTheDocument()
    expect(screen.getByText('Nota máxima superada')).toBeInTheDocument()
    expect(screen.getByText('Puntos por oposiciones aprobadas desde 2000')).toBeInTheDocument()
    expect(screen.queryByText('Nota de la prueba actual')).not.toBeInTheDocument()
  })

  it('shows currentExamGrade and hides bloque_i-only fields for a bloque_ii entry', () => {
    const bloqueIIEntry: InterinosEntryItem = {
      ...bloqueIEntry,
      block: 'bloque_ii',
      highestPassedExamGrade: null,
      pointsFromPassedOppositionsSince2000: null,
      currentExamGrade: { rawValue: '1,5000', value: 1.5 },
    }

    render(<CandidateInterinosSection entries={[bloqueIIEntry]} specialtyLegend={{}} />)

    expect(screen.getByText('Nota de la prueba actual')).toBeInTheDocument()
    expect(screen.queryByText('Nota máxima superada')).not.toBeInTheDocument()
    expect(
      screen.queryByText('Puntos por oposiciones aprobadas desde 2000'),
    ).not.toBeInTheDocument()
  })

  it('flags invalid entries with a plain-language label, not technical validation jargon', () => {
    render(
      <CandidateInterinosSection
        entries={[{ ...bloqueIEntry, valid: false }]}
        specialtyLegend={{}}
      />,
    )

    expect(screen.getByText('Datos incompletos')).toBeInTheDocument()
    expect(screen.queryByText(/validaci/i)).not.toBeInTheDocument()
  })
})
