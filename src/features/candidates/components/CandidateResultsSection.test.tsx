import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CandidateResultsSection } from './CandidateResultsSection'

function renderSection(onSelectCandidate = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/convocations/c2026/specialities/s-infantil/tribunals/t4']}>
        <CandidateResultsSection
          convocationId="c2026"
          specialityId="s-infantil"
          tribunalId="t4"
          onSelectCandidate={onSelectCandidate}
        />
      </MemoryRouter>
    </QueryClientProvider>,
  )
  return { onSelectCandidate }
}

describe('CandidateResultsSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the candidate list with the result count once loaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            columns: [{ key: 'finalScore', label: 'Nota final', sortable: true }],
            items: [
              {
                id: 'cand-1',
                position: 1,
                fullName: 'García López, María',
                status: 'EVALUATED',
                scores: { finalScore: 8.22 },
                hasPosition: null,
              },
            ],
            totalCount: 1,
            page: 0,
            pageSize: 50,
            totalPages: 1,
          }),
      }),
    )

    renderSection()

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText('1 aspirante')).toBeInTheDocument()
  })

  it('shows the empty state message when there are no candidates for the selected filters', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
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
      }),
    )

    renderSection()

    await waitFor(() =>
      expect(
        screen.getByText('No hay aspirantes para los filtros seleccionados.'),
      ).toBeInTheDocument(),
    )
  })

  it('shows a retry option when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500, json: () => Promise.resolve({}) }),
    )

    renderSection()

    await waitFor(() =>
      expect(screen.getByText('No hemos podido cargar los datos.')).toBeInTheDocument(),
    )
  })

  it('navigates to the candidate when a row is selected, carrying the list context', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
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
      }),
    )

    const user = userEvent.setup()
    const { onSelectCandidate } = renderSection()

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    await user.click(screen.getByLabelText('Ver detalle de García López, María'))

    expect(onSelectCandidate).toHaveBeenCalledWith('cand-1', expect.any(URLSearchParams))
    const [, contextParams] = onSelectCandidate.mock.calls[0]
    expect(contextParams.get('convocationId')).toBe('c2026')
    expect(contextParams.get('tribunalId')).toBe('t4')
  })
})
