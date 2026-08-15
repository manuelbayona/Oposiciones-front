import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CandidatesExplorerPage } from './CandidatesExplorerPage'

function renderExplorer(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/convocations/:convocationYear" element={<CandidatesExplorerPage />} />
          <Route
            path="/convocations/:convocationYear/specialities/:specialty"
            element={<CandidatesExplorerPage />}
          />
          <Route
            path="/convocations/:convocationYear/specialities/:specialty/tribunals/:tribunalNumber"
            element={<CandidatesExplorerPage />}
          />
          <Route path="/candidates/:id" element={<div>Candidate detail page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CandidatesExplorerPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prompts to select a specialty once only a convocation is chosen', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderExplorer('/convocations/2026')

    expect(screen.getByText('Selecciona una especialidad para continuar.')).toBeInTheDocument()
  })

  it('prompts to select a tribunal once convocation and specialty are chosen', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderExplorer('/convocations/2026/specialities/EDUCACI%C3%93N%20INFANTIL')

    expect(
      screen.getByText('Selecciona un tribunal para ver el listado de aspirantes.'),
    ).toBeInTheDocument()
  })

  it('shows the candidate results once all three are selected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/candidates')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve([
                { id: 1, maskedIdentifier: '***1234**', fullName: 'García López, María' },
              ]),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    renderExplorer('/convocations/2026/specialities/EDUCACI%C3%93N%20INFANTIL/tribunals/4')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
  })
})
