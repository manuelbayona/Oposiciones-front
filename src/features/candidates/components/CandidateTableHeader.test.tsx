import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateTableHeader } from './CandidateTableHeader'

describe('CandidateTableHeader', () => {
  it('renders a plain header cell without a button when not sortable', () => {
    render(
      <table>
        <thead>
          <tr>
            <CandidateTableHeader
              label="Resultado"
              columnId="hasPosition"
              sortable={false}
              align="left"
              activeSort={null}
              onSort={vi.fn()}
            />
          </tr>
        </thead>
      </table>,
    )
    expect(screen.getByText('Resultado')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('calls onSort with the column id when the sortable header is clicked', async () => {
    const user = userEvent.setup()
    const onSort = vi.fn()
    render(
      <table>
        <thead>
          <tr>
            <CandidateTableHeader
              label="Nota final"
              columnId="finalScore"
              sortable
              align="right"
              activeSort={null}
              onSort={onSort}
            />
          </tr>
        </thead>
      </table>,
    )

    await user.click(screen.getByRole('button', { name: /Nota final/ }))

    expect(onSort).toHaveBeenCalledWith('finalScore')
  })

  it('marks the active column with an aria-sort attribute', () => {
    render(
      <table>
        <thead>
          <tr>
            <CandidateTableHeader
              label="Nota final"
              columnId="finalScore"
              sortable
              align="right"
              activeSort={{ key: 'finalScore', direction: 'desc' }}
              onSort={vi.fn()}
            />
          </tr>
        </thead>
      </table>,
    )

    expect(screen.getByRole('button', { name: /Nota final/ })).toHaveAttribute(
      'aria-sort',
      'descending',
    )
  })
})
