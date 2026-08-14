import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import { useTribunals } from '../queries'

interface TribunalSelectorProps {
  convocationId: string | undefined
  specialityId: string | undefined
  value: string
  onChange: (tribunalId: string) => void
}

export function TribunalSelector({
  convocationId,
  specialityId,
  value,
  onChange,
}: TribunalSelectorProps) {
  const { data, isLoading } = useTribunals(convocationId, specialityId)

  return (
    <LabeledSelect
      id="tribunal-selector"
      label="Tribunal"
      value={value}
      onChange={onChange}
      disabled={!convocationId || !specialityId}
      loading={isLoading}
      placeholder="Selecciona tribunal"
      options={(data ?? []).map((tribunal) => ({
        value: tribunal.id,
        label: tribunal.name,
      }))}
    />
  )
}
