import { render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('wires up routing, layout and data fetching end to end', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) }),
    )

    render(<App />)

    expect(screen.getByRole('link', { name: 'Oposiciones' })).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByText('No hay convocatorias disponibles todavía.')).toBeInTheDocument(),
    )
  })
})
