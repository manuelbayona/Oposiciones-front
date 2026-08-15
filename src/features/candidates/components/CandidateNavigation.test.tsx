import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateNavigation } from './CandidateNavigation'

describe('CandidateNavigation', () => {
  it('renders nothing when there is neither a previous nor a next candidate', () => {
    const { container } = render(
      <CandidateNavigation previousId={null} nextId={null} onNavigate={vi.fn()} />,
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('disables the previous button at the start of the list', () => {
    render(<CandidateNavigation previousId={null} nextId={2} onNavigate={vi.fn()} />)
    expect(screen.getByText('← Aspirante anterior')).toBeDisabled()
    expect(screen.getByText('Aspirante siguiente →')).not.toBeDisabled()
  })

  it('navigates to the next candidate when clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<CandidateNavigation previousId={1} nextId={2} onNavigate={onNavigate} />)

    await user.click(screen.getByText('Aspirante siguiente →'))

    expect(onNavigate).toHaveBeenCalledWith(2)
  })
})
