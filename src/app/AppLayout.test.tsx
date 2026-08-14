import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppLayout } from './AppLayout'

describe('AppLayout', () => {
  it('renders the app title as a link to the home page and the routed page content', () => {
    render(
      <MemoryRouter initialEntries={['/somewhere']}>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/somewhere" element={<p>Page content</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'OpoData' })).toHaveAttribute('href', '/')
    expect(screen.getByText('Entiende tus oposiciones, no solo tu nota.')).toBeInTheDocument()
    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(
      screen.getByText('Información organizada para entender mejor los procesos selectivos docentes.'),
    ).toBeInTheDocument()
  })
})
