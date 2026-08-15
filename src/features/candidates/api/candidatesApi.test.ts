import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  fetchCandidateInterinos,
  fetchCandidateParticipations,
  fetchCandidateResults,
  searchCandidates,
} from './candidatesApi'

function jsonResponse(body: unknown) {
  return { ok: true, status: 200, json: () => Promise.resolve(body) }
}

describe('searchCandidates', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the candidates endpoint with the given filters as query params', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse([]))
    vi.stubGlobal('fetch', fetchMock)

    await searchCandidates({
      name: 'García',
      specialty: 'EDUCACIÓN INFANTIL',
      tribunalNumber: '25',
      convocationYear: 2026,
    })

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates')
    expect(requestedUrl.searchParams.get('name')).toBe('García')
    expect(requestedUrl.searchParams.get('specialty')).toBe('EDUCACIÓN INFANTIL')
    expect(requestedUrl.searchParams.get('tribunalNumber')).toBe('25')
    expect(requestedUrl.searchParams.get('convocationYear')).toBe('2026')
  })
})

describe('fetchCandidateResults', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the results endpoint for the given candidate id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ results: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchCandidateResults(1234)

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates/1234/results')
  })
})

describe('fetchCandidateParticipations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the participations endpoint for the given candidate id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ participations: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchCandidateParticipations(1234)

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates/1234/participations')
  })
})

describe('fetchCandidateInterinos', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('requests the interinos endpoint for the given candidate id', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ entries: [] }))
    vi.stubGlobal('fetch', fetchMock)

    await fetchCandidateInterinos(1234)

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.pathname).toBe('/api/v1/candidates/1234/interinos')
  })
})
