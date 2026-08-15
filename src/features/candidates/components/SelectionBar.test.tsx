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
            path="/convocations/:convocationYear"
            element={<SelectionBar convocationYear="2026" />}
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

  it('navigates to the specialty route when a specialty is selected', async () => {
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
        return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) })
      }),
    )

    const user = userEvent.setup()
    renderSelectionBar('/convocations/2026')

    await waitFor(() => expect(screen.getByText('EDUCACIÓN INFANTIL')).toBeInTheDocument())

    await user.selectOptions(screen.getByLabelText('Especialidad'), 'EDUCACIÓN INFANTIL')

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/convocations/2026/specialities/EDUCACI%C3%93N%20INFANTIL',
      ),
    )
  })
})
