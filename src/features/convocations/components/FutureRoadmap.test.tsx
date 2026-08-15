import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FutureRoadmap } from './FutureRoadmap'

describe('FutureRoadmap', () => {
  it('renders the future-vision copy and the upcoming feature list', () => {
    render(<FutureRoadmap />)

    expect(
      screen.getByRole('heading', { name: 'Una oposición no empieza ni termina en una convocatoria' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Comparación de resultados con convocatorias anteriores.')).toBeInTheDocument()
    expect(screen.getByText('Estadísticas por tribunal y especialidad.')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(8)
  })
})
