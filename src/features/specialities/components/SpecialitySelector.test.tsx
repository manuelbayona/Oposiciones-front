import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SpecialitySelector } from './SpecialitySelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('SpecialitySelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is disabled and does not fetch when no convocation is selected', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(
      <SpecialitySelector convocationId={undefined} value="" onChange={vi.fn()} />,
    )

    expect(screen.getByLabelText('Especialidad')).toBeDisabled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches and lists specialities scoped to the selected convocation', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 's-infantil', name: 'Educación Infantil' }]),
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(<SpecialitySelector convocationId="c2026" value="" onChange={vi.fn()} />)

    await waitFor(() => expect(screen.getByText('Educación Infantil')).toBeInTheDocument())

    const requestedUrl = String(fetchMock.mock.calls[0][0])
    expect(requestedUrl).toContain('/convocations/c2026/specialities')
  })
})
