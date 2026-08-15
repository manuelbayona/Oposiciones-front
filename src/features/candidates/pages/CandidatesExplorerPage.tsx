import { useNavigate, useParams } from 'react-router-dom'
import { SelectionBar } from '../components/SelectionBar'
import { StateMessage } from '../../../shared/components/StateMessage'
import { CandidateResultsSection } from '../components/CandidateResultsSection'

export function CandidatesExplorerPage() {
  const { convocationYear, specialty, tribunalNumber } = useParams()
  const navigate = useNavigate()

  const hasFullSelection = Boolean(convocationYear && specialty && tribunalNumber)

  function handleSelectCandidate(id: number, contextParams: URLSearchParams) {
    navigate(`/candidates/${id}?${contextParams.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <SelectionBar
        convocationYear={convocationYear}
        specialty={specialty}
        tribunalNumber={tribunalNumber}
      />

      {!convocationYear && <StateMessage title="Selecciona una convocatoria para comenzar." />}
      {convocationYear && !specialty && (
        <StateMessage title="Selecciona una especialidad para continuar." />
      )}
      {convocationYear && specialty && !tribunalNumber && (
        <StateMessage title="Selecciona un tribunal para ver el listado de aspirantes." />
      )}

      {hasFullSelection && (
        <CandidateResultsSection
          key={`${convocationYear}-${specialty}-${tribunalNumber}`}
          convocationYear={Number(convocationYear)}
          specialty={specialty!}
          tribunalNumber={tribunalNumber!}
          onSelectCandidate={handleSelectCandidate}
        />
      )}
    </div>
  )
}
