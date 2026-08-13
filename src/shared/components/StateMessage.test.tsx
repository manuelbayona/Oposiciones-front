import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorMessage, StateMessage } from './StateMessage'

describe('StateMessage', () => {
  it('renders the title and optional description', () => {
    render(<StateMessage title="No hay aspirantes" description="Prueba otros filtros." />)
    expect(screen.getByText('No hay aspirantes')).toBeInTheDocument()
    expect(screen.getByText('Prueba otros filtros.')).toBeInTheDocument()
  })
})

describe('ErrorMessage', () => {
  it('calls onRetry when the retry button is clicked', async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    render(<ErrorMessage onRetry={onRetry} />)

    await user.click(screen.getByText('Reintentar'))

    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('does not show a retry button when no handler is provided', () => {
    render(<ErrorMessage />)
    expect(screen.queryByText('Reintentar')).not.toBeInTheDocument()
  })
})
