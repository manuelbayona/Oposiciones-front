import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useSpecialties } from '../queries'

interface SpecialitySelectorProps {
  convocationYear: string | undefined
  value: string
  onChange: (specialty: string) => void
}

export function SpecialitySelector({ convocationYear, value, onChange }: SpecialitySelectorProps) {
  const { data, isLoading } = useSpecialties(convocationYear)

  return (
    <LabeledSelect
      id="speciality-selector"
      label="Especialidad"
      value={value}
      onChange={onChange}
      disabled={!convocationYear}
      loading={isLoading}
      placeholder="Selecciona especialidad"
      options={(data ?? []).map((specialty) => ({
        value: specialty,
        label: specialty,
      }))}
    />
  )
}
