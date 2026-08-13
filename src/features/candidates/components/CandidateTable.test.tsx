import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateTable } from './CandidateTable'
import type { CandidateListColumn, CandidateSummary } from '../model/candidate'

const columns: CandidateListColumn[] = [{ key: 'finalScore', label: 'Nota final', sortable: true }]

const items: CandidateSummary[] = [
  {
    id: 'cand-1',
    position: 1,
    fullName: 'García López, María',
    status: 'EVALUATED',
    scores: { finalScore: 8.22 },
    hasPosition: true,
  },
  {
    id: 'cand-2',
    position: 2,
    fullName: 'Martínez Ruiz, Ana',
    status: 'EVALUATED',
    scores: { finalScore: 8.12 },
    hasPosition: false,
  },
]

describe('CandidateTable', () => {
  it('renders a row per candidate with formatted scores and placement', () => {
    render(
      <CandidateTable
        columns={columns}
        items={items}
        sort={null}
        onSortChange={vi.fn()}
        onSelectCandidate={vi.fn()}
      />,
    )

    expect(screen.getByText('García López, María')).toBeInTheDocument()
    expect(screen.getByText('8,22')).toBeInTheDocument()
    expect(screen.getByText('Plaza')).toBeInTheDocument()
    expect(screen.getByText('Sin plaza')).toBeInTheDocument()
  })

  it('calls onSelectCandidate when a row is clicked', async () => {
    const user = userEvent.setup()
    const onSelectCandidate = vi.fn()
    render(
      <CandidateTable
        columns={columns}
        items={items}
        sort={null}
        onSortChange={vi.fn()}
        onSelectCandidate={onSelectCandidate}
      />,
    )

    await user.click(screen.getByLabelText('Ver detalle de García López, María'))

    expect(onSelectCandidate).toHaveBeenCalledWith('cand-1')
  })

  it('calls onSortChange with the clicked column id', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(
      <CandidateTable
        columns={columns}
        items={items}
        sort={null}
        onSortChange={onSortChange}
        onSelectCandidate={vi.fn()}
      />,
    )

    await user.click(screen.getByRole('button', { name: /Nota final/ }))

    expect(onSortChange).toHaveBeenCalledWith('finalScore')
  })

  it('only shows the placement column when at least one candidate has that information', () => {
    render(
      <CandidateTable
        columns={columns}
        items={items.map((item) => ({ ...item, hasPosition: null }))}
        sort={null}
        onSortChange={vi.fn()}
        onSelectCandidate={vi.fn()}
      />,
    )

    expect(screen.queryByText('Resultado')).not.toBeInTheDocument()
  })
})
