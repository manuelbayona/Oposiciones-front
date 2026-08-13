import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { CandidateStatusBadge, PlacementBadge } from './CandidateStatusBadge'

describe('CandidateStatusBadge', () => {
  it('renders the Spanish label for the given status', () => {
    render(<CandidateStatusBadge status="NOT_PRESENTED" />)
    expect(screen.getByText('No presentado')).toBeInTheDocument()
  })
})

describe('PlacementBadge', () => {
  it('shows "Plaza" when the candidate obtained a position', () => {
    render(<PlacementBadge hasPosition={true} />)
    expect(screen.getByText('Plaza')).toBeInTheDocument()
  })

  it('shows "Sin plaza" when the candidate did not obtain a position', () => {
    render(<PlacementBadge hasPosition={false} />)
    expect(screen.getByText('Sin plaza')).toBeInTheDocument()
  })

  it('shows a dash when placement information is not available, never a false negative', () => {
    render(<PlacementBadge hasPosition={null} />)
    expect(screen.getByText('—')).toBeInTheDocument()
    expect(screen.queryByText('Sin plaza')).not.toBeInTheDocument()
  })
})
