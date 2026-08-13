import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CandidateDetailPage } from './CandidateDetailPage'

function renderDetailPage(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/candidates/:candidateId" element={<CandidateDetailPage />} />
          <Route
            path="/convocations/:convocationId/specialities/:specialityId/tribunals/:tribunalId"
            element={<div>List page</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const candidateDetail = {
  id: 'cand-1',
  fullName: 'García López, María',
  convocation: { id: 'c2026', name: '2026 - Maestros' },
  speciality: { id: 's-infantil', name: 'Educación Infantil' },
  tribunal: { id: 't4', name: 'Tribunal 4' },
  status: 'EVALUATED',
  scoreSections: [],
  merits: null,
  meritsTotal: null,
  result: {
    oppositionScore: 8.75,
    meritsScore: 7.2,
    finalScore: 8.13,
    position: 5,
    hasPosition: true,
  },
  source: null,
}

describe('CandidateDetailPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the candidate name, context and result once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(candidateDetail),
      }),
    )

    renderDetailPage('/candidates/cand-1')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText(/Educación Infantil/)).toBeInTheDocument()
    expect(screen.getByText('8,13')).toBeInTheDocument()
  })

  it('shows a not-found message for a missing candidate instead of a generic error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) }),
    )

    renderDetailPage('/candidates/unknown')

    await waitFor(() =>
      expect(screen.getByText('No se ha encontrado el aspirante solicitado.')).toBeInTheDocument(),
    )
  })

  it('links back to the list preserving the query context when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/candidates?')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                columns: [],
                items: [candidateDetail].map((c) => ({
                  id: c.id,
                  position: 1,
                  fullName: c.fullName,
                  status: c.status,
                  scores: {},
                  hasPosition: null,
                })),
                totalCount: 1,
                page: 0,
                pageSize: 50,
                totalPages: 1,
              }),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(candidateDetail),
        })
      }),
    )

    renderDetailPage('/candidates/cand-1?convocationId=c2026&specialityId=s-infantil&tribunalId=t4')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText('← Volver a Tribunal 4')).toHaveAttribute(
      'href',
      expect.stringContaining('/convocations/c2026/specialities/s-infantil/tribunals/t4'),
    )
  })
})
