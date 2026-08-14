import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useCandidateDetail, useCandidateList } from '../queries/candidateQueries'
import { CandidateStatusBadge } from '../components/CandidateStatusBadge'
import { CandidateScores } from '../components/CandidateScores'
import { CandidateMerits } from '../components/CandidateMerits'
import { CandidateResult } from '../components/CandidateResult'
import { CandidateSourceInfo } from '../components/CandidateSourceInfo'
import { CandidateNavigation } from '../components/CandidateNavigation'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { parseSort, serializeSort } from '../model/sort'
import { CANDIDATE_LIST_PAGE_SIZE } from '../model/constants'
import { NotFoundError } from '../../../shared/api/errors'

export function CandidateDetailPage() {
  const { candidateId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const contextConvocationId = searchParams.get('convocationId') ?? undefined
  const contextSpecialityId = searchParams.get('specialityId') ?? undefined
  const contextTribunalId = searchParams.get('tribunalId') ?? undefined
  const contextSearch = searchParams.get('q') ?? undefined
  const contextSort = parseSort(searchParams.get('sort'))
  const contextPage = Number(searchParams.get('page') ?? '0')

  const hasListContext = Boolean(contextConvocationId && contextSpecialityId && contextTribunalId)

  const { data: candidate, isLoading, isError, error, refetch } = useCandidateDetail(candidateId)

  const { data: list } = useCandidateList(
    hasListContext
      ? {
          convocationId: contextConvocationId!,
          specialityId: contextSpecialityId!,
          tribunalId: contextTribunalId!,
          search: contextSearch,
          sort: serializeSort(contextSort),
          page: contextPage,
          size: CANDIDATE_LIST_PAGE_SIZE,
        }
      : undefined,
  )

  const backUrl = hasListContext
    ? `/convocations/${contextConvocationId}/specialities/${contextSpecialityId}/tribunals/${contextTribunalId}?${searchParams.toString()}`
    : null

  const currentIndex = list?.items?.findIndex((item) => item.id === candidateId) ?? -1
  const previousId = currentIndex > 0 ? list!.items[currentIndex - 1].id : null
  const nextId =
    currentIndex >= 0 && currentIndex < (list?.items?.length ?? 0) - 1
      ? list!.items[currentIndex + 1].id
      : null

  function navigateToCandidate(id: string) {
    navigate(`/candidates/${id}?${searchParams.toString()}`)
  }

  if (isLoading) {
    return <StateMessage title="Cargando aspirante…" />
  }

  if (error instanceof NotFoundError) {
    return <StateMessage title="No se ha encontrado el aspirante solicitado." />
  }

  if (isError || !candidate) {
    return <ErrorMessage onRetry={() => refetch()} />
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Link
          to={backUrl ?? '/'}
          className="text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          ← Volver a {candidate.tribunal.name}
        </Link>
      </div>

      <header className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-semibold text-slate-900">{candidate.fullName}</h1>
          <CandidateStatusBadge status={candidate.status} />
        </div>
        <p className="text-sm text-slate-500">
          {candidate.speciality.name} · {candidate.tribunal.name} · {candidate.convocation.name}
        </p>
      </header>

      <CandidateScores sections={candidate.scoreSections} />
      <CandidateMerits merits={candidate.merits} total={candidate.meritsTotal} />
      <CandidateResult result={candidate.result} />

      {candidate.source && <CandidateSourceInfo source={candidate.source} />}

      <CandidateNavigation
        previousId={previousId}
        nextId={nextId}
        onNavigate={navigateToCandidate}
      />
    </div>
  )
}
