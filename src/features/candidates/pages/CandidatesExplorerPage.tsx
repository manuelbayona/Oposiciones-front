import { useNavigate, useParams } from 'react-router-dom'
import { SelectionBar } from '../components/SelectionBar'
import { StateMessage } from '../../../shared/components/StateMessage'
import { CandidateResultsSection } from '../components/CandidateResultsSection'

export function CandidatesExplorerPage() {
  const { convocationId, specialityId, tribunalId } = useParams()
  const navigate = useNavigate()

  const hasFullSelection = Boolean(convocationId && specialityId && tribunalId)

  function handleSelectCandidate(candidateId: string, contextParams: URLSearchParams) {
    navigate(`/candidates/${candidateId}?${contextParams.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <SelectionBar
        convocationId={convocationId}
        specialityId={specialityId}
        tribunalId={tribunalId}
      />

      {!convocationId && <StateMessage title="Selecciona una convocatoria para comenzar." />}
      {convocationId && !specialityId && (
        <StateMessage title="Selecciona una especialidad para continuar." />
      )}
      {convocationId && specialityId && !tribunalId && (
        <StateMessage title="Selecciona un tribunal para ver el listado de aspirantes." />
      )}

      {hasFullSelection && (
        <CandidateResultsSection
          key={`${convocationId}-${specialityId}-${tribunalId}`}
          convocationId={convocationId!}
          specialityId={specialityId!}
          tribunalId={tribunalId!}
          onSelectCandidate={handleSelectCandidate}
        />
      )}
    </div>
  )
}
