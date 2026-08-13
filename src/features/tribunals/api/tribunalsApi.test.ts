import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTribunals } from './tribunalsApi'

describe('fetchTribunals', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests tribunals scoped to the given convocation and speciality', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchTribunals('c2026', 's-infantil')

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe(
      '/api/v1/convocations/c2026/specialities/s-infantil/tribunals',
    )
  })
})
