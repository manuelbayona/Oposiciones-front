import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchSpecialities } from './specialitiesApi'

describe('fetchSpecialities', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests specialities scoped to the given convocation', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchSpecialities('c2026')

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/convocations/c2026/specialities')
  })
})
