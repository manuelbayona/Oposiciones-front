import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LabeledSelect } from './LabeledSelect'

const options = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
]

describe('LabeledSelect', () => {
  it('calls onChange with the selected option value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <LabeledSelect
        id="test-select"
        label="Convocatoria"
        value=""
        options={options}
        placeholder="Selecciona"
        onChange={onChange}
      />,
    )

    await user.selectOptions(screen.getByLabelText('Convocatoria'), 'b')

    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('disables the select and shows a loading placeholder while loading', () => {
    render(
      <LabeledSelect
        id="test-select"
        label="Especialidad"
        value=""
        options={[]}
        placeholder="Selecciona especialidad"
        loading
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Especialidad')).toBeDisabled()
    expect(screen.getByText('Cargando…')).toBeInTheDocument()
  })

  it('disables the select when explicitly marked disabled', () => {
    render(
      <LabeledSelect
        id="test-select"
        label="Tribunal"
        value=""
        options={options}
        placeholder="Selecciona tribunal"
        disabled
        onChange={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Tribunal')).toBeDisabled()
  })
})
