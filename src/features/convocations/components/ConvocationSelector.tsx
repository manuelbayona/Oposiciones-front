import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useConvocationYears } from '../queries'

interface ConvocationSelectorProps {
  value: string
  onChange: (convocationYear: string) => void
}

export function ConvocationSelector({ value, onChange }: ConvocationSelectorProps) {
  const { data, isLoading } = useConvocationYears()

  return (
    <LabeledSelect
      id="convocation-selector"
      label="Convocatoria"
      value={value}
      onChange={onChange}
      loading={isLoading}
      placeholder="Selecciona convocatoria"
      options={(data ?? []).map((year) => ({
        value: String(year),
        label: String(year),
      }))}
    />
  )
}
