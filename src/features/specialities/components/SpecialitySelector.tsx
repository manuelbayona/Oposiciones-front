import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useSpecialities } from '../queries'

interface SpecialitySelectorProps {
  convocationId: string | undefined
  value: string
  onChange: (specialityId: string) => void
}

export function SpecialitySelector({ convocationId, value, onChange }: SpecialitySelectorProps) {
  const { data, isLoading } = useSpecialities(convocationId)

  return (
    <LabeledSelect
      id="speciality-selector"
      label="Especialidad"
      value={value}
      onChange={onChange}
      disabled={!convocationId}
      loading={isLoading}
      placeholder="Selecciona especialidad"
      options={(data ?? []).map((speciality) => ({
        value: speciality.id,
        label: speciality.name,
      }))}
    />
  )
}
