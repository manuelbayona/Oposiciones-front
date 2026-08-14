import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { HomePage } from './HomePage'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function renderHomePage() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <LocationDisplay />
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('HomePage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders the landing page content regardless of convocation state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderHomePage()

    expect(
      screen.getByRole('heading', { name: 'Todos los resultados de la oposición, en un solo lugar' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Consultar resultados' })).toHaveAttribute(
      'href',
      '#consultar',
    )
    expect(screen.getByRole('heading', { name: '¿Cómo ha evolucionado un aspirante?' })).toBeInTheDocument()
  })

  it('shows a message in the picker when there are no convocations available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderHomePage()

    await waitFor(() =>
      expect(screen.getByText('No hay convocatorias disponibles todavía.')).toBeInTheDocument(),
    )
  })

  it('navigates to the tribunal listing once a full selection is made and submitted', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/tribunals')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 't25', name: 'Tribunal 25' }]),
          })
        }
        if (url.includes('/specialities')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 's-infantil', name: 'Educación Infantil' }]),
          })
        }
        if (url.includes('/convocations')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 'c2026', name: '2026 - Maestros', year: 2026 }]),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    const user = userEvent.setup()
    renderHomePage()

    await waitFor(() => expect(screen.getByText('2026 - Maestros')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Convocatoria'), 'c2026')
    await waitFor(() => expect(screen.getByText('Educación Infantil')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Especialidad'), 's-infantil')
    await waitFor(() => expect(screen.getByText('Tribunal 25')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Tribunal'), 't25')

    await user.click(screen.getByRole('button', { name: 'Ver aspirantes' }))

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/convocations/c2026/specialities/s-infantil/tribunals/t25',
      ),
    )
  })
})
