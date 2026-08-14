import { useNavigate } from 'react-router-dom'
import { ConvocationSelector } from '../../convocations/components/ConvocationSelector'
import { SpecialitySelector } from '../../specialities/components/SpecialitySelector'
import { TribunalSelector } from '../../tribunals/components/TribunalSelector'

interface SelectionBarProps {
  convocationId?: string
  specialityId?: string
  tribunalId?: string
}

export function SelectionBar({ convocationId, specialityId, tribunalId }: SelectionBarProps) {
  const navigate = useNavigate()

  function handleConvocationChange(nextConvocationId: string) {
    if (!nextConvocationId) {
      navigate('/')
      return
    }
    navigate(`/convocations/${nextConvocationId}`)
  }

  function handleSpecialityChange(nextSpecialityId: string) {
    if (!nextSpecialityId) {
      navigate(`/convocations/${convocationId}`)
      return
    }
    navigate(`/convocations/${convocationId}/specialities/${nextSpecialityId}`)
  }

  function handleTribunalChange(nextTribunalId: string) {
    if (!nextTribunalId) {
      navigate(`/convocations/${convocationId}/specialities/${specialityId}`)
      return
    }
    navigate(
      `/convocations/${convocationId}/specialities/${specialityId}/tribunals/${nextTribunalId}`,
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row">
      <ConvocationSelector value={convocationId ?? ''} onChange={handleConvocationChange} />
      <SpecialitySelector
        convocationId={convocationId}
        value={specialityId ?? ''}
        onChange={handleSpecialityChange}
      />
      <TribunalSelector
        convocationId={convocationId}
        specialityId={specialityId}
        value={tribunalId ?? ''}
        onChange={handleTribunalChange}
      />
    </div>
  )
}
