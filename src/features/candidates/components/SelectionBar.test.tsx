import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { SelectionBar } from './SelectionBar'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{location.pathname}</div>
}

function renderSelectionBar(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <LocationDisplay />
        <Routes>
          <Route
            path="/convocations/:convocationId"
            element={<SelectionBar convocationId="c2026" />}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('SelectionBar', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('navigates to the speciality route when a speciality is selected', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((url: string) => {
        if (url.includes('/specialities')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve([{ id: 's-infantil', name: 'Educación Infantil' }]),
          })
        }
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    const user = userEvent.setup()
    renderSelectionBar('/convocations/c2026')

    await waitFor(() => expect(screen.getByText('Educación Infantil')).toBeInTheDocument())

    await user.selectOptions(screen.getByLabelText('Especialidad'), 's-infantil')

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/convocations/c2026/specialities/s-infantil',
      ),
    )
  })
})
