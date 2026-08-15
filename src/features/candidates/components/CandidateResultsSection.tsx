import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CandidateSearch } from './CandidateSearch'
import { CandidateTable } from './CandidateTable'
import { ResultsCount } from './ResultsCount'
import { useCandidateSearch } from '../queries/candidateQueries'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { TableSkeleton } from '../../../shared/components/Skeleton'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'

interface CandidateResultsSectionProps {
  convocationYear: number
  specialty: string
  tribunalNumber: string
  onSelectCandidate: (id: number, contextParams: URLSearchParams) => void
}

export function CandidateResultsSection({
  convocationYear,
  specialty,
  tribunalNumber,
  onSelectCandidate,
}: CandidateResultsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') ?? ''
  const [searchInput, setSearchInput] = useState(search)
  const debouncedSearch = useDebouncedValue(searchInput, 300)

  useEffect(() => {
    if (debouncedSearch === search) {
      return
    }
    const next = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      next.set('q', debouncedSearch)
    } else {
      next.delete('q')
    }
    setSearchParams(next, { replace: true })
  }, [debouncedSearch, search, searchParams, setSearchParams])

  const { data, isLoading, isError, refetch } = useCandidateSearch({
    convocationYear,
    specialty,
    tribunalNumber,
    name: search || undefined,
  })

  function handleSelectCandidate(id: number) {
    const context = new URLSearchParams({
      convocationYear: String(convocationYear),
      specialty,
      tribunalNumber,
    })
    if (search) context.set('q', search)
    onSelectCandidate(id, context)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <CandidateSearch value={searchInput} onChange={setSearchInput} />
        {data && <ResultsCount totalCount={data.length} />}
      </div>

      {isLoading && <TableSkeleton columns={1} />}

      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <StateMessage
          title={
            search
              ? `No se han encontrado aspirantes que coincidan con "${search}".`
              : 'No hay aspirantes para los filtros seleccionados.'
          }
        />
      )}

      {data && data.length > 0 && (
        <CandidateTable items={data} onSelectCandidate={handleSelectCandidate} />
      )}
    </div>
  )
}
