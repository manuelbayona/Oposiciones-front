import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiGet } from './client'
import { ApiError, NotFoundError } from './errors'

describe('apiGet', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns the parsed JSON body on success', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ hello: 'world' }),
      }),
    )

    await expect(apiGet('/convocations')).resolves.toEqual({ hello: 'world' })
  })

  it('omits undefined and empty query params from the request URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', fetchMock)

    await apiGet('/candidates', { search: undefined, tribunalId: '', convocationId: '12' })

    const requestedUrl = new URL(fetchMock.mock.calls[0][0])
    expect(requestedUrl.searchParams.has('search')).toBe(false)
    expect(requestedUrl.searchParams.has('tribunalId')).toBe(false)
    expect(requestedUrl.searchParams.get('convocationId')).toBe('12')
  })

  it('throws NotFoundError on a 404 response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) }),
    )

    await expect(apiGet('/candidates/missing')).rejects.toBeInstanceOf(NotFoundError)
  })

  it('throws ApiError on other non-ok responses', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }),
    )

    await expect(apiGet('/candidates')).rejects.toBeInstanceOf(ApiError)
  })

  it('throws ApiError when the network request itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiGet('/candidates')).rejects.toBeInstanceOf(ApiError)
  })
})
