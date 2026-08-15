import { useNavigate } from 'react-router-dom'
import { ConvocationSelector } from '../../convocations/components/ConvocationSelector'
import { SpecialitySelector } from '../../specialities/components/SpecialitySelector'
import { TribunalSelector } from '../../tribunals/components/TribunalSelector'

interface SelectionBarProps {
  convocationYear?: string
  specialty?: string
  tribunalNumber?: string
}

export function SelectionBar({ convocationYear, specialty, tribunalNumber }: SelectionBarProps) {
  const navigate = useNavigate()

  function handleConvocationChange(nextConvocationYear: string) {
    if (!nextConvocationYear) {
      navigate('/')
      return
    }
    navigate(`/convocations/${encodeURIComponent(nextConvocationYear)}`)
  }

  function handleSpecialtyChange(nextSpecialty: string) {
    if (!nextSpecialty) {
      navigate(`/convocations/${encodeURIComponent(convocationYear!)}`)
      return
    }
    navigate(
      `/convocations/${encodeURIComponent(convocationYear!)}/specialities/${encodeURIComponent(nextSpecialty)}`,
    )
  }

  function handleTribunalChange(nextTribunalNumber: string) {
    if (!nextTribunalNumber) {
      navigate(
        `/convocations/${encodeURIComponent(convocationYear!)}/specialities/${encodeURIComponent(specialty!)}`,
      )
      return
    }
    navigate(
      `/convocations/${encodeURIComponent(convocationYear!)}/specialities/${encodeURIComponent(specialty!)}/tribunals/${encodeURIComponent(nextTribunalNumber)}`,
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
      <ConvocationSelector value={convocationYear ?? ''} onChange={handleConvocationChange} />
      <SpecialitySelector
        convocationYear={convocationYear}
        value={specialty ?? ''}
        onChange={handleSpecialtyChange}
      />
      <TribunalSelector
        convocationYear={convocationYear}
        specialty={specialty}
        value={tribunalNumber ?? ''}
        onChange={handleTribunalChange}
      />
    </div>
  )
}
