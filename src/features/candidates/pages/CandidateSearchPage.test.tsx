import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CandidateSearchPage } from './CandidateSearchPage'

function renderSearchPage(initialPath = '/buscar') {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/buscar" element={<CandidateSearchPage />} />
          <Route path="/candidates/:id" element={<div>Candidate detail page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('CandidateSearchPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('prompts to type a name before searching', () => {
    renderSearchPage()

    expect(screen.getByText('Escribe un nombre para empezar a buscar.')).toBeInTheDocument()
  })

  it('shows matching candidates once a name is typed', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([{ id: 1, maskedIdentifier: '***1234**', fullName: 'García López, María' }]),
      }),
    )

    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByLabelText('Buscar aspirante'), 'García')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    expect(screen.getByText('1 aspirante')).toBeInTheDocument()
  })

  it('shows an empty-results message when nothing matches', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByLabelText('Buscar aspirante'), 'Nadie')

    await waitFor(() =>
      expect(
        screen.getByText('No se han encontrado aspirantes que coincidan con "Nadie".'),
      ).toBeInTheDocument(),
    )
  })

  it('navigates straight to the candidate detail page when a result is clicked', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([{ id: 1, maskedIdentifier: '***1234**', fullName: 'García López, María' }]),
      }),
    )

    const user = userEvent.setup()
    renderSearchPage()

    await user.type(screen.getByLabelText('Buscar aspirante'), 'García')
    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
    await user.click(screen.getByLabelText('Ver detalle de García López, María'))

    await waitFor(() => expect(screen.getByText('Candidate detail page')).toBeInTheDocument())
  })

  it('starts from a name already present in the URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([{ id: 1, maskedIdentifier: '***1234**', fullName: 'García López, María' }]),
      }),
    )

    renderSearchPage('/buscar?q=Garc%C3%ADa')

    await waitFor(() => expect(screen.getByText('García López, María')).toBeInTheDocument())
  })
})
