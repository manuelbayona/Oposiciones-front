import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateSourceInfo } from './CandidateSourceInfo'

describe('CandidateSourceInfo', () => {
  it('renders the source title and formatted date', () => {
    render(
      <CandidateSourceInfo
        source={{ title: 'Listado definitivo de notas del Tribunal 4', date: '2026-06-20' }}
      />,
    )
    expect(screen.getByText(/Listado definitivo de notas del Tribunal 4/)).toBeInTheDocument()
    expect(screen.getByText(/20\/06\/2026/)).toBeInTheDocument()
  })

  it('omits the date segment when no date is provided', () => {
    render(<CandidateSourceInfo source={{ title: 'Acta del tribunal', date: null }} />)
    expect(screen.getByText('Fuente: Acta del tribunal')).toBeInTheDocument()
  })
})
