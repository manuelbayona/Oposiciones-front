import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchInterinosSpecialtyLegend, searchInterinos } from './interinosApi'

function jsonResponse(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) }
}

describe('searchInterinos', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the interinos endpoint with the given filters as query params', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        jsonResponse({ items: [], page: 0, size: 50, totalElements: 0, totalPages: 0 }),
      )
    vi.stubGlobal('fetch', fetchMock)

    await searchInterinos({ block: 'bloque_i', specialtyCode: '031', page: 1, size: 50 })

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/interinos')
    expect(requestedUrl.searchParams.get('block')).toBe('bloque_i')
    expect(requestedUrl.searchParams.get('specialtyCode')).toBe('031')
    expect(requestedUrl.searchParams.get('page')).toBe('1')
    expect(requestedUrl.searchParams.get('size')).toBe('50')
  })
})

describe('fetchInterinosSpecialtyLegend', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the specialties legend endpoint', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}))
    vi.stubGlobal('fetch', fetchMock)

    await fetchInterinosSpecialtyLegend()

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/interinos/specialties')
  })
})
