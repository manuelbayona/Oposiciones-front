import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TableSkeleton } from './Skeleton'

describe('TableSkeleton', () => {
  it('renders the requested number of placeholder rows and columns', () => {
    const { container } = render(<TableSkeleton rows={3} columns={4} />)
    const rows = container.firstElementChild!.children
    expect(rows).toHaveLength(3)
    expect(rows[0].children).toHaveLength(4)
  })

  it('is hidden from assistive technology while data is loading', () => {
    const { container } = render(<TableSkeleton />)
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true')
  })
})
