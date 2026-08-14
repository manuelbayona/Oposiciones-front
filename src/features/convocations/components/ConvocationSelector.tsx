import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useConvocations } from '../queries'

interface ConvocationSelectorProps {
  value: string
  onChange: (convocationId: string) => void
}

export function ConvocationSelector({ value, onChange }: ConvocationSelectorProps) {
  const { data, isLoading } = useConvocations()

  return (
    <LabeledSelect
      id="convocation-selector"
      label="Convocatoria"
      value={value}
      onChange={onChange}
      loading={isLoading}
      placeholder="Selecciona convocatoria"
      options={(data ?? []).map((convocation) => ({
        value: convocation.id,
        label: convocation.name,
      }))}
    />
  )
}
