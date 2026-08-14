import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TribunalSelector } from './TribunalSelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('TribunalSelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is disabled until both convocation year and specialty are selected', () => {
    renderWithQueryClient(
      <TribunalSelector
        convocationYear="2026"
        specialty={undefined}
        value=""
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Tribunal')).toBeDisabled()
  })

  it('fetches tribunal numbers scoped to the selected convocation year and specialty', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(['4']),
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(
      <TribunalSelector
        convocationYear="2026"
        specialty="EDUCACIÓN INFANTIL"
        value=""
        onChange={vi.fn()}
      />,
    )

    await waitFor(() => expect(screen.getByText('4')).toBeInTheDocument())

    const requestedUrl = String(fetchMock.mock.calls[0][0])
    expect(requestedUrl).toContain('/participations/tribunal-numbers')
    expect(requestedUrl).toContain('convocationYear=2026')
    expect(requestedUrl).toContain('specialty=')
  })
})
