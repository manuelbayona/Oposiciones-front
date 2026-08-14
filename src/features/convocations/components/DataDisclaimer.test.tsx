import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataDisclaimer } from './DataDisclaimer'

describe('DataDisclaimer', () => {
  it('warns that official publications take precedence over the displayed data', () => {
    render(<DataDisclaimer />)

    expect(screen.getByRole('heading', { name: 'Sobre los datos' })).toBeInTheDocument()
    expect(
      screen.getByText(/deberán considerarse siempre como referencia los documentos y publicaciones oficiales/),
    ).toBeInTheDocument()
  })
})
