import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchConvocations } from './convocationsApi'

describe('fetchConvocations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the convocations endpoint', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchMock)

    await fetchConvocations()

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/convocations')
  })
})
