import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SpecialtyBadges } from './SpecialtyBadges'

describe('SpecialtyBadges', () => {
  it('labels each code using the legend when available', () => {
    render(
      <SpecialtyBadges
        codes={['031', '038']}
        specialtyLegend={{ '031': 'Educación infantil', '038': 'Educación primaria' }}
      />,
    )

    expect(screen.getByText('Educación infantil')).toBeInTheDocument()
    expect(screen.getByText('Educación primaria')).toBeInTheDocument()
  })

  it('falls back to the raw code when the legend has no entry for it', () => {
    render(<SpecialtyBadges codes={['999']} specialtyLegend={{ '031': 'Educación infantil' }} />)

    expect(screen.getByText('999')).toBeInTheDocument()
  })

  it('falls back to raw codes when the legend has not loaded yet', () => {
    render(<SpecialtyBadges codes={['031']} specialtyLegend={undefined} />)

    expect(screen.getByText('031')).toBeInTheDocument()
  })
})
