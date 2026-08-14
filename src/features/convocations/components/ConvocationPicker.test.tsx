import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ConvocationPicker } from './ConvocationPicker'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function renderPicker() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <LocationDisplay />
        <Routes>
          <Route path="/" element={<ConvocationPicker />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('ConvocationPicker', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('disables the submit button until a convocation, specialty and tribunal are chosen', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/tribunal-numbers')) {
          return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(['25']) })
        }
        if (url.includes('/specialties')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(['EDUCACIÓN INFANTIL']),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([2026]) })
      }),
    )

    const user = userEvent.setup()
    renderPicker()

    const submit = screen.getByRole('button', { name: 'Ver aspirantes' })
    expect(submit).toBeDisabled()

    await waitFor(() => expect(screen.getByText('2026')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Convocatoria'), '2026')
    await waitFor(() => expect(screen.getByText('EDUCACIÓN INFANTIL')).toBeInTheDocument())
    expect(submit).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Especialidad'), 'EDUCACIÓN INFANTIL')
    await waitFor(() => expect(screen.getByText('25')).toBeInTheDocument())
    expect(submit).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Tribunal'), '25')
    expect(submit).toBeEnabled()

    await user.click(submit)

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/convocations/2026/specialities/EDUCACI%C3%93N%20INFANTIL/tribunals/25',
      ),
    )
  })

  it('resets the specialty and tribunal selection when the convocation changes', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/specialties')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve(['EDUCACIÓN INFANTIL']),
          })
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([2026, 2024]),
        })
      }),
    )

    const user = userEvent.setup()
    renderPicker()

    await waitFor(() => expect(screen.getByText('2026')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Convocatoria'), '2026')
    await waitFor(() => expect(screen.getByText('EDUCACIÓN INFANTIL')).toBeInTheDocument())
    await user.selectOptions(screen.getByLabelText('Especialidad'), 'EDUCACIÓN INFANTIL')

    await user.selectOptions(screen.getByLabelText('Convocatoria'), '2024')

    expect(screen.getByLabelText<HTMLSelectElement>('Especialidad').value).toBe('')
  })

  it('shows a message when there are no convocations available', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    renderPicker()

    await waitFor(() =>
      expect(screen.getByText('No hay convocatorias disponibles todavía.')).toBeInTheDocument(),
    )
  })

  it('shows an error state with a retry action when the convocations request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }))

    renderPicker()

    await waitFor(() =>
      expect(screen.getByText('No hemos podido cargar los datos.')).toBeInTheDocument(),
    )
  })
})
