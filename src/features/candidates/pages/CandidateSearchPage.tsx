import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CandidateSearch } from '../components/CandidateSearch'
import { CandidateTable } from '../components/CandidateTable'
import { ResultsCount } from '../components/ResultsCount'
import { useCandidateSearch } from '../queries/candidateQueries'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { TableSkeleton } from '../../../shared/components/Skeleton'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'

/**
 * Standalone name search, independent of the convocation/speciality/tribunal picker flow in
 * CandidatesExplorerPage — you type a name and go straight to a matching aspirante's detail,
 * without first knowing which convocation/specialty/tribunal they belong to.
 */
export function CandidateSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const urlQuery = searchParams.get('q') ?? ''
  const [queryInput, setQueryInput] = useState(urlQuery)
  const debouncedQuery = useDebouncedValue(queryInput, 300)
  const trimmedQuery = debouncedQuery.trim()

  useEffect(() => {
    if (trimmedQuery === urlQuery) {
      return
    }
    const next = new URLSearchParams(searchParams)
    if (trimmedQuery) {
      next.set('q', trimmedQuery)
    } else {
      next.delete('q')
    }
    setSearchParams(next, { replace: true })
  }, [trimmedQuery, urlQuery, searchParams, setSearchParams])

  const { data, isLoading, isError, refetch } = useCandidateSearch(
    trimmedQuery ? { name: trimmedQuery } : undefined,
  )

  function handleSelectCandidate(id: number) {
    const context = new URLSearchParams({ from: 'search' })
    if (trimmedQuery) context.set('q', trimmedQuery)
    navigate(`/candidates/${id}?${context.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">Buscar aspirante</h1>
        <p className="text-sm text-slate-500">
          Busca por nombre y accede directamente a la ficha del aspirante, sin pasar por
          convocatoria, especialidad o tribunal.
        </p>
      </header>

      <CandidateSearch value={queryInput} onChange={setQueryInput} />

      {!trimmedQuery && (
        <StateMessage title="Escribe un nombre para empezar a buscar." />
      )}

      {trimmedQuery && isLoading && <TableSkeleton columns={1} />}

      {trimmedQuery && isError && <ErrorMessage onRetry={() => refetch()} />}

      {trimmedQuery && data && data.length === 0 && (
        <StateMessage title={`No se han encontrado aspirantes que coincidan con "${trimmedQuery}".`} />
      )}

      {trimmedQuery && data && data.length > 0 && (
        <>
          <ResultsCount totalCount={data.length} />
          <CandidateTable items={data} onSelectCandidate={handleSelectCandidate} />
        </>
      )}
    </div>
  )
}
