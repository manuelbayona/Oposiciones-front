import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useCandidateDetail, useCandidateList } from './candidateQueries'

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useCandidateList', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not fetch when params are undefined', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHook(() => useCandidateList(undefined), { wrapper })

    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches the candidate list once params are provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          columns: [],
          items: [],
          totalCount: 0,
          page: 0,
          pageSize: 50,
          totalPages: 0,
        }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(
      () =>
        useCandidateList({
          convocationId: 'c2026',
          specialityId: 's-infantil',
          tribunalId: 't4',
        }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalled()
  })
})

describe('useCandidateDetail', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not fetch when the id is undefined', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHook(() => useCandidateDetail(undefined), { wrapper })

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
