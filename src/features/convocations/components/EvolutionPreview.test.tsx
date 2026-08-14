import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EvolutionPreview } from './EvolutionPreview'

describe('EvolutionPreview', () => {
  it('renders the illustrative before/after evolution mock-up', () => {
    render(<EvolutionPreview />)

    expect(screen.getByRole('heading', { name: '¿Cómo ha evolucionado un aspirante?' })).toBeInTheDocument()
    expect(screen.getByText('Oposición 2026 · Nota: 8,42')).toBeInTheDocument()
    expect(screen.getByText('Nota oposición')).toBeInTheDocument()
    expect(screen.getByText('7,34 → 8,12 → 8,42')).toBeInTheDocument()
    expect(screen.getByText('Ejemplo ilustrativo de una funcionalidad todavía en desarrollo.')).toBeInTheDocument()
  })
})
