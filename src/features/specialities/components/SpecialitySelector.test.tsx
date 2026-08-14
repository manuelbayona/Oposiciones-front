import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SpecialitySelector } from './SpecialitySelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('SpecialitySelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is disabled and does not fetch when no convocation year is selected', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(
      <SpecialitySelector convocationYear={undefined} value="" onChange={vi.fn()} />,
    )

    expect(screen.getByLabelText('Especialidad')).toBeDisabled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches and lists specialties scoped to the selected convocation year', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(['EDUCACIÓN INFANTIL']),
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(
      <SpecialitySelector convocationYear="2026" value="" onChange={vi.fn()} />,
    )

    await waitFor(() => expect(screen.getByText('EDUCACIÓN INFANTIL')).toBeInTheDocument())

    const requestedUrl = String(fetchMock.mock.calls[0][0])
    expect(requestedUrl).toContain('/participations/specialties')
    expect(requestedUrl).toContain('convocationYear=2026')
  })
})
