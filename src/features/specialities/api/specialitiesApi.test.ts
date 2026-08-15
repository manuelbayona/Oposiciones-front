import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchSpecialties } from './specialitiesApi'

describe('fetchSpecialties', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests specialties scoped to the given convocation year', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchSpecialties('2026')

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/participations/specialties')
    expect(requestedUrl.searchParams.get('convocationYear')).toBe('2026')
  })
})
