import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

function renderHomePage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/convocations/:convocationId" element={<div>Convocation page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('redirects to the most recent convocation once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            { id: 'c2024', name: '2024 - Maestros', year: 2024 },
            { id: 'c2026', name: '2026 - Maestros', year: 2026 },
          ]),
      }),
    )

    renderHomePage()

    await waitFor(() => expect(screen.getByText('Convocation page')).toBeInTheDocument())
  })

  it('shows a message when there are no convocations available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderHomePage()

    await waitFor(() =>
      expect(screen.getByText('No hay convocatorias disponibles todavía.')).toBeInTheDocument(),
    )
  })
})
