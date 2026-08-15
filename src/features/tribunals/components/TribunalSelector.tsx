import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useTribunalNumbers } from '../queries'

interface TribunalSelectorProps {
  convocationYear: string | undefined
  specialty: string | undefined
  value: string
  onChange: (tribunalNumber: string) => void
}

export function TribunalSelector({
  convocationYear,
  specialty,
  value,
  onChange,
}: TribunalSelectorProps) {
  const { data, isLoading } = useTribunalNumbers(convocationYear, specialty)

  return (
    <LabeledSelect
      id="tribunal-selector"
      label="Tribunal"
      value={value}
      onChange={onChange}
      disabled={!convocationYear || !specialty}
      loading={isLoading}
      placeholder="Selecciona tribunal"
      options={(data ?? []).map((tribunalNumber) => ({
        value: tribunalNumber,
        label: tribunalNumber,
      }))}
    />
  )
}
