import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateMerits } from './CandidateMerits'

describe('CandidateMerits', () => {
  it('renders a dash placeholder when there are no merits', () => {
    render(<CandidateMerits merits={null} total={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('renders top-level items and their nested children with the total', () => {
    render(
      <CandidateMerits
        merits={[
          {
            key: 'experience',
            label: 'Experiencia docente',
            value: 4.5,
            children: [{ key: 'teaching', label: 'Docencia directa', value: 3.0 }],
          },
        ]}
        total={7.2}
      />,
    )

    expect(screen.getByText('Experiencia docente')).toBeInTheDocument()
    expect(screen.getByText('Docencia directa')).toBeInTheDocument()
    expect(screen.getByText('Total méritos')).toBeInTheDocument()
    expect(screen.getByText('7,20')).toBeInTheDocument()
  })
})
