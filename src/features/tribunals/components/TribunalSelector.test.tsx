import { screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TribunalSelector } from './TribunalSelector'
import { renderWithQueryClient } from '../../../test/renderWithQueryClient'

describe('TribunalSelector', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('is disabled until both convocation and speciality are selected', () => {
    renderWithQueryClient(
      <TribunalSelector
        convocationId="c2026"
        specialityId={undefined}
        value=""
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Tribunal')).toBeDisabled()
  })

  it('fetches tribunals scoped to the selected convocation and speciality', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ id: 't4', name: 'Tribunal 4' }]),
    })
    vi.stubGlobal('fetch', fetchMock)

    renderWithQueryClient(
      <TribunalSelector
        convocationId="c2026"
        specialityId="s-infantil"
        value=""
        onChange={vi.fn()}
      />,
    )

    await waitFor(() => expect(screen.getByText('Tribunal 4')).toBeInTheDocument())

    const requestedUrl = String(fetchMock.mock.calls[0][0])
    expect(requestedUrl).toContain('/convocations/c2026/specialities/s-infantil/tribunals')
  })
})
