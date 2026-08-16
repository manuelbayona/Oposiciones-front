import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateExamResults } from './CandidateExamResults'
import type { ExamResultItem } from '../model/candidate'

const twoPartResult: ExamResultItem = {
  sourceDocument: '/data/EI-25.pdf',
  documentType: 'calificaciones',
  examName: 'PRIMERA PRUEBA',
  phase: 'primera_prueba',
  body: 'MAESTROS',
  specialty: 'EDUCACIÓN INFANTIL',
  tribunalNumber: '25',
  convocationYear: 2026,
  convocationCode: 'OPOPRI26',
  accessCode: '1',
  parts: [
    { partCode: 'A', score: { rawValue: '3,3450', value: 3.345 } },
    { partCode: 'B', score: { rawValue: '1,5200', value: 1.52 } },
  ],
  totalScore: { rawValue: '4,8650', value: 4.865 },
  attendanceStatus: 'presentado',
  valid: true,
  extractorVersion: '0.1.0',
  processedAt: '2026-08-13T11:20:50Z',
  passStatus: 'UNKNOWN',
}

describe('CandidateExamResults', () => {
  it('shows a placeholder when there are no results', () => {
    render(<CandidateExamResults results={[]} />)

    expect(screen.getByText('Calificaciones')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders the convocation heading, the phase label (not the raw examName), each part and the total score', () => {
    render(<CandidateExamResults results={[twoPartResult]} />)

    expect(screen.getByText('Convocatoria OPOPRI26')).toBeInTheDocument()
    expect(screen.getByText('Primera prueba')).toBeInTheDocument()
    expect(screen.queryByText('PRIMERA PRUEBA')).not.toBeInTheDocument()
    expect(screen.getByText('presentado')).toBeInTheDocument()
    expect(screen.getByText('Parte A')).toBeInTheDocument()
    expect(screen.getByText('Parte B')).toBeInTheDocument()
    expect(screen.getByText('3,35')).toBeInTheDocument()
    expect(screen.getByText('4,87')).toBeInTheDocument()
  })

  it('falls back to the raw examName when the backend could not classify the phase', () => {
    const unclassifiedResult: ExamResultItem = {
      ...twoPartResult,
      examName: 'UN TEXTO NO RECONOCIDO',
      phase: null,
    }

    render(<CandidateExamResults results={[unclassifiedResult]} />)

    expect(screen.getByText('UN TEXTO NO RECONOCIDO')).toBeInTheDocument()
  })

  it('falls back to the convocation year when no convocation code is available', () => {
    render(<CandidateExamResults results={[{ ...twoPartResult, convocationCode: null }]} />)

    expect(screen.getByText('Convocatoria 2026')).toBeInTheDocument()
  })

  it('groups results from different convocations under separate headings, ordered by year', () => {
    const result2022: ExamResultItem = {
      ...twoPartResult,
      sourceDocument: '/data/EI-06-2022.pdf',
      convocationYear: 2022,
      convocationCode: 'OPOPRI22',
      tribunalNumber: '06',
    }

    render(<CandidateExamResults results={[twoPartResult, result2022]} />)

    const headings = screen.getAllByText(/^Convocatoria /)
    expect(headings.map((heading) => heading.textContent)).toEqual([
      'Convocatoria OPOPRI22',
      'Convocatoria OPOPRI26',
    ])
  })

  it('keeps every reported part within its convocation, so subsections beyond A/B still show', () => {
    const threePartResult: ExamResultItem = {
      ...twoPartResult,
      parts: [
        ...twoPartResult.parts,
        { partCode: 'C', score: { rawValue: '2,0000', value: 2 } },
      ],
    }

    render(<CandidateExamResults results={[threePartResult]} />)

    expect(screen.getByText('Parte C')).toBeInTheDocument()
  })

  it('hides the total score row when the source document publishes no separate total', () => {
    const singleMarkResult: ExamResultItem = {
      ...twoPartResult,
      examName: 'SEGUNDA PRUEBA',
      phase: 'segunda_prueba',
      parts: [{ partCode: 'unica', score: { rawValue: '9,2900', value: 9.29 } }],
      totalScore: { rawValue: '', value: null },
    }

    render(<CandidateExamResults results={[singleMarkResult]} />)

    expect(screen.getByText('Parte unica')).toBeInTheDocument()
    expect(screen.queryByText('Nota total')).not.toBeInTheDocument()
  })

  it('flags results with validation issues', () => {
    render(<CandidateExamResults results={[{ ...twoPartResult, valid: false }]} />)

    expect(screen.getByText('Con incidencias de validación')).toBeInTheDocument()
  })

  it('shows an "Aprobó" badge when the candidate passed', () => {
    render(<CandidateExamResults results={[{ ...twoPartResult, passStatus: 'PASSED' }]} />)

    expect(screen.getByText('Aprobó')).toBeInTheDocument()
  })

  it('shows a "No aprobó" badge when the candidate did not pass', () => {
    render(<CandidateExamResults results={[{ ...twoPartResult, passStatus: 'NOT_PASSED' }]} />)

    expect(screen.getByText('No aprobó')).toBeInTheDocument()
  })

  it('shows no pass/fail badge when no official listing has settled the outcome yet', () => {
    render(<CandidateExamResults results={[{ ...twoPartResult, passStatus: 'UNKNOWN' }]} />)

    expect(screen.queryByText('Aprobó')).not.toBeInTheDocument()
    expect(screen.queryByText('No aprobó')).not.toBeInTheDocument()
  })
})
