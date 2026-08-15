import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { InterinosListPage } from './InterinosListPage'

function renderListPage(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/interinos" element={<InterinosListPage />} />
          <Route path="/candidates/:id" element={<div>Candidate detail page</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const searchResponse = {
  items: [
    {
      candidateId: 1,
      maskedIdentifier: '***8381**',
      fullName: 'VICENTE SANCHEZ, SOFIA',
      listPosition: 400,
      accreditedSpecialtyCodes: ['031'],
      block: 'bloque_i',
      totalScore: { rawValue: '9,2900', value: 9.29 },
      highestPassedExamGrade: { rawValue: '7,2900', value: 7.29 },
      pointsFromPassedOppositionsSince2000: { rawValue: '2,0000', value: 2 },
      currentExamGrade: null,
    },
  ],
  page: 0,
  size: 50,
  totalElements: 1,
  totalPages: 1,
}

function stubFetch() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((url: string) => {
      if (url.includes('/interinos/specialties')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ '031': 'Educación infantil' }),
        })
      }
      if (url.includes('/interinos')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(searchResponse),
        })
      }
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
    }),
  )
}

describe('InterinosListPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows the entries once loaded', async () => {
    stubFetch()

    renderListPage('/interinos')

    await waitFor(() => expect(screen.getByText('VICENTE SANCHEZ, SOFIA')).toBeInTheDocument())
    expect(screen.getByText('1 aspirante')).toBeInTheDocument()
  })

  it('navigates to the candidate detail page with the interinos context when a row is clicked', async () => {
    stubFetch()

    renderListPage('/interinos?block=bloque_i')

    await waitFor(() => expect(screen.getByText('VICENTE SANCHEZ, SOFIA')).toBeInTheDocument())
    await userEvent.click(screen.getByRole('button', { name: /VICENTE SANCHEZ, SOFIA/ }))

    await waitFor(() => expect(screen.getByText('Candidate detail page')).toBeInTheDocument())
  })

  it('shows the specialty-rank column only when a specialtyCode filter is in the URL', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/interinos/specialties')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ '031': 'Educación infantil' }),
          })
        }
        if (url.includes('/interinos')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                ...searchResponse,
                items: [{ ...searchResponse.items[0], specialtyRank: 5 }],
              }),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    renderListPage('/interinos?specialtyCode=031')

    await waitFor(() => expect(screen.getByText('VICENTE SANCHEZ, SOFIA')).toBeInTheDocument())
    expect(screen.getByText('Puesto en la especialidad')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })
})
