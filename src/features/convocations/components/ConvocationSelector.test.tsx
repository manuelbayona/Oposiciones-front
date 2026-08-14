import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConvocationSelector } from './ConvocationSelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('ConvocationSelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads convocation years and reports the selected year', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve([2026, 2024]),
      }),
    )

    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithQueryClient(<ConvocationSelector value="" onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('2026')).toBeInTheDocument())

    await user.selectOptions(screen.getByLabelText('Convocatoria'), '2024')

    expect(onChange).toHaveBeenCalledWith('2024')
  })
})
