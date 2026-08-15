import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useInterinosSearch, useInterinosSpecialtyLegend } from './interinosQueries'

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('useInterinosSearch', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches interinos entries matching the given params', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({ items: [], page: 0, size: 50, totalElements: 0, totalPages: 0 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useInterinosSearch({ block: 'bloque_i' }), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchMock).toHaveBeenCalled()
  })
})

describe('useInterinosSpecialtyLegend', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('fetches the specialty legend', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ '031': 'Educación infantil' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const { result } = renderHook(() => useInterinosSpecialtyLegend(), { wrapper })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual({ '031': 'Educación infantil' })
  })
})
