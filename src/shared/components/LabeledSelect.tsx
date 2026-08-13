import type { ChangeEvent } from 'react'

export interface SelectOption {
  value: string
  label: string
}

interface LabeledSelectProps {
  id: string
  label: string
  value: string
  options: SelectOption[]
  placeholder: string
  disabled?: boolean
  loading?: boolean
  onChange: (value: string) => void
}

export function LabeledSelect({
  id,
  label,
  value,
  options,
  placeholder,
  disabled,
  loading,
  onChange,
}: LabeledSelectProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value)
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium text-slate-600">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        disabled={disabled || loading}
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      >
        <option value="">{loading ? 'Cargando…' : placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
