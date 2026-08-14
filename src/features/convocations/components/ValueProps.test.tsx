import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ValueProps } from './ValueProps'

describe('ValueProps', () => {
  it('lists the three ways to work with the data', () => {
    render(<ValueProps />)

    expect(screen.getByRole('heading', { name: 'Toda la convocatoria de un vistazo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Busca' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ordena' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Consulta' })).toBeInTheDocument()
  })
})
