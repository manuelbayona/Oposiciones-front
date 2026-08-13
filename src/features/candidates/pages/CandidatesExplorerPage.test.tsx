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
          <Route path="/convocations/:convocationId" element={<CandidatesExplorerPage />} />
          <Route
            path="/convocations/:convocationId/specialities/:specialityId"
            element={<CandidatesExplorerPage />}
          />
          <Route
            path="/convocations/:convocationId/specialities/:specialityId/tribunals/:tribunalId"
            element={<CandidatesExplorerPage />}
          />
          <Route path="/candidates/:candidateId" element={<div>Candidate detail page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CandidatesExplorerPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prompts to select a speciality once only a convocation is chosen', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderExplorer('/convocations/c2026')

    expect(screen.getByText('Selecciona una especialidad para continuar.')).toBeInTheDocument()
  })

  it('prompts to select a tribunal once convocation and speciality are chosen', () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderExplorer('/convocations/c2026/specialities/s-infantil')

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
              Promise.resolve({
                columns: [],
                items: [
                  {
                    id: 'cand-1',
                    position: 1,
                    fullName: 'García López, María',
                    status: 'EVALUATED',
                    scores: {},
                    hasPosition: null,
                  },
                ],
                totalCount: 1,
                page: 0,
                pageSize: 50,
                totalPages: 1,
              }),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    renderExplorer('/convocations/c2026/specialities/s-infantil/tribunals/t4')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
  })
})
