import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { InterinosFilters } from './InterinosFilters'

describe('InterinosFilters', () => {
  it('lists specialty options from the legend', () => {
    render(
      <InterinosFilters
        block=""
        specialtyCode=""
        specialtyLegend={{ '031': 'Educación infantil' }}
        specialtyLegendLoading={false}
        onBlockChange={vi.fn()}
        onSpecialtyCodeChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('option', { name: 'Educación infantil' })).toBeInTheDocument()
  })

  it('notifies when the block changes', async () => {
    const onBlockChange = vi.fn()
    render(
      <InterinosFilters
        block=""
        specialtyCode=""
        specialtyLegend={{}}
        specialtyLegendLoading={false}
        onBlockChange={onBlockChange}
        onSpecialtyCodeChange={vi.fn()}
      />,
    )

    await userEvent.selectOptions(screen.getByLabelText('Bloque'), 'bloque_i')

    expect(onBlockChange).toHaveBeenCalledWith('bloque_i')
  })
})
