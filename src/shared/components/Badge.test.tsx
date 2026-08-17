import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge tone="neutral">presentado</Badge>)

    expect(screen.getByText('presentado')).toBeInTheDocument()
  })

  it('applies a tooltip when a title is given', () => {
    render(
      <Badge tone="warning" title="El documento no incluye todos los datos.">
        Datos incompletos
      </Badge>,
    )

    expect(screen.getByText('Datos incompletos')).toHaveAttribute(
      'title',
      'El documento no incluye todos los datos.',
    )
  })
})
