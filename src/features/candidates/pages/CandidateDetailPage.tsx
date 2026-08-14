import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  useCandidateParticipations,
  useCandidateResults,
  useCandidateSearch,
} from '../queries/candidateQueries'
import { CandidateParticipations } from '../components/CandidateParticipations'
import { CandidateExamResults } from '../components/CandidateExamResults'
import { CandidateNavigation } from '../components/CandidateNavigation'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { NotFoundError } from '../../../shared/api/errors'

export function CandidateDetailPage() {
  const { maskedIdentifier } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const contextConvocationYear = searchParams.get('convocationYear') ?? undefined
  const contextSpecialty = searchParams.get('specialty') ?? undefined
  const contextTribunalNumber = searchParams.get('tribunalNumber') ?? undefined
  const contextSearch = searchParams.get('q') ?? undefined

  const hasListContext = Boolean(
    contextConvocationYear && contextSpecialty && contextTribunalNumber,
  )

  const {
    data: results,
    isLoading: resultsLoading,
    isError: resultsError,
    error: resultsErrorDetail,
    refetch: refetchResults,
  } = useCandidateResults(maskedIdentifier)
  const {
    data: participations,
    isLoading: participationsLoading,
    isError: participationsError,
    refetch: refetchParticipations,
  } = useCandidateParticipations(maskedIdentifier)

  const { data: list } = useCandidateSearch(
    hasListContext
      ? {
          convocationYear: Number(contextConvocationYear),
          specialty: contextSpecialty,
          tribunalNumber: contextTribunalNumber,
          name: contextSearch,
        }
      : undefined,
  )

  const backUrl = hasListContext
    ? `/convocations/${encodeURIComponent(contextConvocationYear!)}/specialities/${encodeURIComponent(contextSpecialty!)}/tribunals/${encodeURIComponent(contextTribunalNumber!)}?${searchParams.toString()}`
    : null

  const currentIndex = list?.findIndex((item) => item.maskedIdentifier === maskedIdentifier) ?? -1
  const previousId = currentIndex > 0 ? list![currentIndex - 1].maskedIdentifier : null
  const nextId =
    currentIndex >= 0 && currentIndex < (list?.length ?? 0) - 1
      ? list![currentIndex + 1].maskedIdentifier
      : null

  function navigateToCandidate(id: string) {
    navigate(`/candidates/${encodeURIComponent(id)}?${searchParams.toString()}`)
  }

  if (resultsLoading || participationsLoading) {
    return <StateMessage title="Cargando aspirante…" />
  }

  if (resultsErrorDetail instanceof NotFoundError) {
    return <StateMessage title="No se ha encontrado el aspirante solicitado." />
  }

  if (resultsError || participationsError || !results || !participations) {
    return (
      <ErrorMessage
        onRetry={() => {
          refetchResults()
          refetchParticipations()
        }}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={backUrl ?? '/'}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Volver al listado
        </Link>
      </div>

      <header className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-slate-900">{results.fullName}</h1>
        <p className="text-sm text-slate-500">{results.maskedIdentifier}</p>
      </header>

      <CandidateParticipations participations={participations.participations} />
      <CandidateExamResults results={results.results} />

      <CandidateNavigation
        previousId={previousId}
        nextId={nextId}
        onNavigate={navigateToCandidate}
      />
    </div>
  )
}
