import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultsCount } from './ResultsCount'

describe('ResultsCount', () => {
  it('uses the plural form for counts other than one', () => {
    render(<ResultsCount totalCount={87} />)
    expect(screen.getByText('87 aspirantes')).toBeInTheDocument()
  })

  it('uses the singular form for exactly one result', () => {
    render(<ResultsCount totalCount={1} />)
    expect(screen.getByText('1 aspirante')).toBeInTheDocument()
  })

  it('renders zero results explicitly rather than hiding the count', () => {
    render(<ResultsCount totalCount={0} />)
    expect(screen.getByText('0 aspirantes')).toBeInTheDocument()
  })
})
