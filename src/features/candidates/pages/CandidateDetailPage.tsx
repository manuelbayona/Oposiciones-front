import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  useCandidateInterinos,
  useCandidateParticipations,
  useCandidateResults,
  useCandidateSearch,
} from '../queries/candidateQueries'
import { CandidateParticipations } from '../components/CandidateParticipations'
import { CandidateExamResults } from '../components/CandidateExamResults'
import { CandidateNavigation } from '../components/CandidateNavigation'
import { CandidateInterinosSection } from '../../interinos/components/CandidateInterinosSection'
import { useInterinosSpecialtyLegend } from '../../interinos/queries/interinosQueries'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { NotFoundError } from '../../../shared/api/errors'

export function CandidateDetailPage() {
  const { id } = useParams()
  const candidateId = id !== undefined ? Number(id) : undefined
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const contextConvocationYear = searchParams.get('convocationYear') ?? undefined
  const contextSpecialty = searchParams.get('specialty') ?? undefined
  const contextTribunalNumber = searchParams.get('tribunalNumber') ?? undefined
  const contextSearch = searchParams.get('q') ?? undefined

  const hasListContext = Boolean(
    contextConvocationYear && contextSpecialty && contextTribunalNumber,
  )

  const fromInterinos = searchParams.get('from') === 'interinos'
  const fromSearch = searchParams.get('from') === 'search'

  const {
    data: results,
    isLoading: resultsLoading,
    isError: resultsError,
    error: resultsErrorDetail,
    refetch: refetchResults,
  } = useCandidateResults(candidateId)
  const {
    data: participations,
    isLoading: participationsLoading,
    isError: participationsError,
    refetch: refetchParticipations,
  } = useCandidateParticipations(candidateId)
  const {
    data: interinos,
    isLoading: interinosLoading,
    isError: interinosError,
    refetch: refetchInterinos,
  } = useCandidateInterinos(candidateId)
  const { data: specialtyLegend } = useInterinosSpecialtyLegend()

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

  const interinosBackParams = new URLSearchParams()
  const interinosBlock = searchParams.get('interinosBlock')
  const interinosSpecialtyCode = searchParams.get('interinosSpecialtyCode')
  const interinosPage = searchParams.get('interinosPage')
  if (interinosBlock) interinosBackParams.set('block', interinosBlock)
  if (interinosSpecialtyCode) interinosBackParams.set('specialtyCode', interinosSpecialtyCode)
  if (interinosPage) interinosBackParams.set('page', interinosPage)

  const backUrl = hasListContext
    ? `/convocations/${encodeURIComponent(contextConvocationYear!)}/specialities/${encodeURIComponent(contextSpecialty!)}/tribunals/${encodeURIComponent(contextTribunalNumber!)}?${searchParams.toString()}`
    : fromInterinos
      ? `/interinos?${interinosBackParams.toString()}`
      : fromSearch
        ? `/buscar${contextSearch ? `?q=${encodeURIComponent(contextSearch)}` : ''}`
        : null

  const backLabel = fromSearch ? '← Volver a la búsqueda' : '← Volver al listado'

  const currentIndex = list?.findIndex((item) => item.id === candidateId) ?? -1
  const previousId = currentIndex > 0 ? list![currentIndex - 1].id : null
  const nextId =
    currentIndex >= 0 && currentIndex < (list?.length ?? 0) - 1
      ? list![currentIndex + 1].id
      : null

  function navigateToCandidate(id: number) {
    navigate(`/candidates/${id}?${searchParams.toString()}`)
  }

  if (resultsLoading || participationsLoading || interinosLoading) {
    return <StateMessage title="Cargando aspirante…" />
  }

  if (resultsErrorDetail instanceof NotFoundError) {
    return <StateMessage title="No se ha encontrado el aspirante solicitado." />
  }

  if (
    resultsError ||
    participationsError ||
    interinosError ||
    !results ||
    !participations ||
    !interinos
  ) {
    return (
      <ErrorMessage
        onRetry={() => {
          refetchResults()
          refetchParticipations()
          refetchInterinos()
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
          {backLabel}
        </Link>
      </div>

      <header className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4">
        <h1 className="text-xl font-semibold text-slate-900">{results.fullName}</h1>
        <p className="text-sm text-slate-500">{results.maskedIdentifier}</p>
      </header>

      <CandidateParticipations participations={participations.participations} />
      <CandidateExamResults results={results.results} />
      <CandidateInterinosSection entries={interinos.entries} specialtyLegend={specialtyLegend} />

      <CandidateNavigation
        previousId={previousId}
        nextId={nextId}
        onNavigate={navigateToCandidate}
      />
    </div>
  )
}
