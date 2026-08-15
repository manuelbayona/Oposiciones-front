import { LabeledSelect } from '../../../shared/components/LabeledSelect'
import type { SpecialtyLegend } from '../model/interinos'

const BLOCK_OPTIONS = [
  { value: 'bloque_i', label: 'Bloque I' },
  { value: 'bloque_ii', label: 'Bloque II' },
]

interface InterinosFiltersProps {
  block: string
  specialtyCode: string
  specialtyLegend: SpecialtyLegend | undefined
  specialtyLegendLoading: boolean
  onBlockChange: (value: string) => void
  onSpecialtyCodeChange: (value: string) => void
}

export function InterinosFilters({
  block,
  specialtyCode,
  specialtyLegend,
  specialtyLegendLoading,
  onBlockChange,
  onSpecialtyCodeChange,
}: InterinosFiltersProps) {
  const specialtyOptions = Object.entries(specialtyLegend ?? {}).map(([code, name]) => ({
    value: code,
    label: name,
  }))

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <LabeledSelect
        id="interinos-block"
        label="Bloque"
        value={block}
        options={BLOCK_OPTIONS}
        placeholder="Todos los bloques"
        onChange={onBlockChange}
      />
      <LabeledSelect
        id="interinos-specialty"
        label="Especialidad"
        value={specialtyCode}
        options={specialtyOptions}
        placeholder="Todas las especialidades"
        loading={specialtyLegendLoading}
        onChange={onSpecialtyCodeChange}
      />
    </div>
  )
}
