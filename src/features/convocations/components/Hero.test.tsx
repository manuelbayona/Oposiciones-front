import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Hero } from './Hero'

describe('Hero', () => {
  it('renders the headline, supporting copy and a CTA linking to the picker', () => {
    render(<Hero />)

    expect(
      screen.getByRole('heading', { name: 'Todos los resultados de la oposición, en un solo lugar' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Consulta aspirantes, notas y resultados/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Consultar resultados' })).toHaveAttribute(
      'href',
      '#consultar',
    )
  })
})
