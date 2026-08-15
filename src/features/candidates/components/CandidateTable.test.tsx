import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateTable } from './CandidateTable'
import type { CandidateSummary } from '../model/candidate'

const items: CandidateSummary[] = [
  { maskedIdentifier: '***1234**', fullName: 'García López, María' },
  { maskedIdentifier: '***5678**', fullName: 'Martínez Ruiz, Ana' },
]

describe('CandidateTable', () => {
  it('renders a row per candidate', () => {
    render(<CandidateTable items={items} onSelectCandidate={vi.fn()} />)

    expect(screen.getByText('García López, María')).toBeInTheDocument()
    expect(screen.getByText('Martínez Ruiz, Ana')).toBeInTheDocument()
  })

  it('calls onSelectCandidate with the masked identifier when a row is clicked', async () => {
    const user = userEvent.setup()
    const onSelectCandidate = vi.fn()
    render(<CandidateTable items={items} onSelectCandidate={onSelectCandidate} />)

    await user.click(screen.getByLabelText('Ver detalle de García López, María'))

    expect(onSelectCandidate).toHaveBeenCalledWith('***1234**')
  })
})
