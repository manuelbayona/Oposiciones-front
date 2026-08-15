import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InterinosTable } from './InterinosTable'
import type { InterinosListingEntryItem } from '../model/interinos'

const entry: InterinosListingEntryItem = {
  candidateId: 1,
  maskedIdentifier: '***8381**',
  fullName: 'VICENTE SANCHEZ, SOFIA',
  listPosition: 400,
  specialtyRank: null,
  accreditedSpecialtyCodes: ['031'],
  block: 'bloque_i',
  totalScore: { rawValue: '9,2900', value: 9.29 },
  highestPassedExamGrade: { rawValue: '7,2900', value: 7.29 },
  pointsFromPassedOppositionsSince2000: { rawValue: '2,0000', value: 2 },
  currentExamGrade: null,
}

describe('InterinosTable', () => {
  it('renders one row per entry with its position, name, block and score', () => {
    render(
      <InterinosTable
        items={[entry]}
        specialtyLegend={{ '031': 'Educación infantil' }}
        specialtyFilterActive={false}
        onSelectCandidate={vi.fn()}
      />,
    )

    expect(screen.getByText('400')).toBeInTheDocument()
    expect(screen.getByText('VICENTE SANCHEZ, SOFIA')).toBeInTheDocument()
    expect(screen.getByText('Bloque I')).toBeInTheDocument()
    expect(screen.getByText('Educación infantil')).toBeInTheDocument()
    expect(screen.getByText('9,29')).toBeInTheDocument()
  })

  it('calls onSelectCandidate with the candidate id when a row is clicked', async () => {
    const onSelectCandidate = vi.fn()
    render(
      <InterinosTable
        items={[entry]}
        specialtyLegend={{}}
        specialtyFilterActive={false}
        onSelectCandidate={onSelectCandidate}
      />,
    )

    await userEvent.click(screen.getByRole('button', { name: /VICENTE SANCHEZ, SOFIA/ }))

    expect(onSelectCandidate).toHaveBeenCalledWith(1)
  })

  it('shows the specialty-rank column only when a specialty filter is active', () => {
    const ranked = { ...entry, specialtyRank: 3 }
    const { rerender } = render(
      <InterinosTable
        items={[ranked]}
        specialtyLegend={{}}
        specialtyFilterActive={false}
        onSelectCandidate={vi.fn()}
      />,
    )

    expect(screen.queryByText('Puesto en la especialidad')).not.toBeInTheDocument()

    rerender(
      <InterinosTable
        items={[ranked]}
        specialtyLegend={{}}
        specialtyFilterActive={true}
        onSelectCandidate={vi.fn()}
      />,
    )

    expect(screen.getByText('Puesto en la especialidad')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
