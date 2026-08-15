import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchConvocationYears } from './convocationsApi'

describe('fetchConvocationYears', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the convocation-years endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchConvocationYears()

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/participations/convocation-years')
  })
})
