import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  useCandidateParticipations,
  useCandidateResults,
  useCandidateSearch,
} from './candidateQueries'

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useCandidateSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches candidates matching the given params', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([]),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(
      () =>
        useCandidateSearch({
          convocationYear: 2026,
          specialty: 'EDUCACIÓN INFANTIL',
          tribunalNumber: '25',
        }),
      { wrapper },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalled()
  })
})

describe('useCandidateResults', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not fetch when the masked identifier is undefined', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHook(() => useCandidateResults(undefined), { wrapper })

    expect(fetchMock).not.toHaveBeenCalled()
  })
})

describe('useCandidateParticipations', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not fetch when the masked identifier is undefined', () => {
    const fetchMock = vi.fn()
    vi.stubGlobal('fetch', fetchMock)

    renderHook(() => useCandidateParticipations(undefined), { wrapper })

    expect(fetchMock).not.toHaveBeenCalled()
  })
})
