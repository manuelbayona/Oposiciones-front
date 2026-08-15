import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchTribunalNumbers } from './tribunalsApi'

describe('fetchTribunalNumbers', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests tribunal numbers scoped to the given convocation year and specialty', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchTribunalNumbers('2026', 'EDUCACIÓN INFANTIL')

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/participations/tribunal-numbers')
    expect(requestedUrl.searchParams.get('convocationYear')).toBe('2026')
    expect(requestedUrl.searchParams.get('specialty')).toBe('EDUCACIÓN INFANTIL')
  })
})
