import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CandidateSearch } from './CandidateSearch'

describe('CandidateSearch', () => {
  it('calls onChange for each keystroke with the input value at that point', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<CandidateSearch value="" onChange={onChange} />)

    await user.type(screen.getByLabelText('Buscar aspirante'), 'Gar')

    expect(onChange).toHaveBeenCalledTimes(3)
    expect(onChange).toHaveBeenNthCalledWith(1, 'G')
  })

  it('reflects the current value in the input', () => {
    render(<CandidateSearch value="García" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Buscar aspirante')).toHaveValue('García')
  })
})
