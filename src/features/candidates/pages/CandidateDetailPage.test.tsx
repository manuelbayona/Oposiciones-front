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
          <Route path="/candidates/:id" element={<CandidateDetailPage />} />
          <Route
            path="/convocations/:convocationYear/specialities/:specialty/tribunals/:tribunalNumber"
            element={<div>List page</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const resultsResponse = {
  id: 1,
  maskedIdentifier: '***1234**',
  fullName: 'García López, María',
  results: [
    {
      sourceDocument: '/data/EI-25.pdf',
      documentType: 'calificaciones',
      examName: 'PRIMERA PRUEBA',
      body: 'MAESTROS',
      specialty: 'EDUCACIÓN INFANTIL',
      tribunalNumber: '4',
      accessCode: '1',
      parts: [{ partCode: 'A', score: { rawValue: '8,7500', value: 8.75 } }],
      totalScore: { rawValue: '8,7500', value: 8.75 },
      attendanceStatus: 'presentado',
      valid: true,
      extractorVersion: '0.1.0',
      processedAt: '2026-08-13T11:20:50Z',
    },
  ],
}

const participationsResponse = {
  id: 1,
  maskedIdentifier: '***1234**',
  fullName: 'García López, María',
  participations: [
    {
      convocationYear: 2026,
      convocationCode: null,
      body: 'MAESTROS',
      specialty: 'EDUCACIÓN INFANTIL',
      tribunalNumber: '4',
      totalMeritScore: 7.2,
    },
  ],
}

const interinosResponse = {
  id: 1,
  maskedIdentifier: '***1234**',
  fullName: 'García López, María',
  entries: [],
}

function stubFetch(overrides: (url: string) => Response | undefined = () => undefined) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      const override = overrides(url)
      if (override) return Promise.resolve(override)
      if (url.includes('/results')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(resultsResponse),
        })
      }
      if (url.includes('/participations')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(participationsResponse),
        })
      }
      if (url.includes('/interinos/specialties')) {
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({}) })
      }
      if (url.includes('/interinos')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(interinosResponse),
        })
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
    }),
  )
}

describe('CandidateDetailPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the candidate name, participations and results once loaded', async () => {
    stubFetch()

    renderDetailPage('/candidates/1')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText('PRIMERA PRUEBA')).toBeInTheDocument()
    expect(screen.getByText('7,20')).toBeInTheDocument()
  })

  it('shows a not-found message for a missing candidate instead of a generic error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 404, json: () => Promise.resolve({}) }),
    )

    renderDetailPage('/candidates/9999')

    await waitFor(() =>
      expect(screen.getByText('No se ha encontrado el aspirante solicitado.')).toBeInTheDocument(),
    )
  })

  it('links back to the list preserving the query context when present', async () => {
    stubFetch((url) => {
      if (url.includes('/candidates?')) {
        return {
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve([
              { id: 1, maskedIdentifier: '***1234**', fullName: 'García López, María' },
            ]),
        } as unknown as Response
      }
      return undefined
    })

    renderDetailPage(
      '/candidates/1?convocationYear=2026&specialty=EDUCACI%C3%93N%20INFANTIL&tribunalNumber=4',
    )

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText('← Volver al listado')).toHaveAttribute(
      'href',
      expect.stringContaining(
        '/convocations/2026/specialities/EDUCACI%C3%93N%20INFANTIL/tribunals/4',
      ),
    )
  })
})
