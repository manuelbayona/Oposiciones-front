import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateExamResults } from './CandidateExamResults'
import type { ExamResultItem } from '../model/candidate'

const twoPartResult: ExamResultItem = {
  sourceDocument: '/data/EI-25.pdf',
  documentType: 'calificaciones',
  examName: 'PRIMERA PRUEBA',
  body: 'MAESTROS',
  specialty: 'EDUCACIÓN INFANTIL',
  tribunalNumber: '25',
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

  it('renders each part and the total score for a two-part exam', () => {
    render(<CandidateExamResults results={[twoPartResult]} />)

    expect(screen.getByText('PRIMERA PRUEBA')).toBeInTheDocument()
    expect(screen.getByText('presentado')).toBeInTheDocument()
    expect(screen.getByText('Parte A')).toBeInTheDocument()
    expect(screen.getByText('Parte B')).toBeInTheDocument()
    expect(screen.getByText('3,35')).toBeInTheDocument()
    expect(screen.getByText('4,87')).toBeInTheDocument()
  })

  it('hides the total score row when the source document publishes no separate total', () => {
    const singleMarkResult: ExamResultItem = {
      ...twoPartResult,
      examName: 'SEGUNDA PRUEBA',
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
