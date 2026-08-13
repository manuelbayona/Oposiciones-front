import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConvocationSelector } from './ConvocationSelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('ConvocationSelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loads convocations and reports the selected id', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            { id: 'c2026', name: '2026 - Maestros', year: 2026 },
            { id: 'c2024', name: '2024 - Maestros', year: 2024 },
          ]),
      }),
    )

    const onChange = vi.fn()
    const user = userEvent.setup()
    renderWithQueryClient(<ConvocationSelector value="" onChange={onChange} />)

    await waitFor(() => expect(screen.getByText('2026 - Maestros')).toBeInTheDocument())

    await user.selectOptions(screen.getByLabelText('Convocatoria'), 'c2024')

    expect(onChange).toHaveBeenCalledWith('c2024')
  })
})
