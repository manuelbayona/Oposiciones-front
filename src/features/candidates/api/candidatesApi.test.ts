import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchCandidate, fetchCandidates } from './candidatesApi'

function jsonResponse(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) }
}

describe('fetchCandidates', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the candidates endpoint with the given filters as query params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ items: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchCandidates({
      convocationId: 'c2026',
      specialityId: 's-infantil',
      tribunalId: 't4',
      search: 'García',
      sort: 'finalScore,desc',
      page: 1,
      size: 50,
    })

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates')
    expect(requestedUrl.searchParams.get('convocationId')).toBe('c2026')
    expect(requestedUrl.searchParams.get('search')).toBe('García')
    expect(requestedUrl.searchParams.get('sort')).toBe('finalScore,desc')
    expect(requestedUrl.searchParams.get('page')).toBe('1')
  })
})

describe('fetchCandidate', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the candidate detail endpoint by id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ id: 'cand-1' }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchCandidate('cand-1')

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates/cand-1')
  })
})
