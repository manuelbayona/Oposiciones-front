import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CandidateSearch } from './CandidateSearch'
import { CandidateTable } from './CandidateTable'
import { ResultsCount } from './ResultsCount'
import { useCandidateList } from '../queries/candidateQueries'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { TableSkeleton } from '../../../shared/components/Skeleton'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { Pagination } from '../../../shared/components/Pagination'
import { nextSort, parseSort, serializeSort } from '../model/sort'
import { CANDIDATE_LIST_PAGE_SIZE } from '../model/constants'

interface CandidateResultsSectionProps {
  convocationId: string
  specialityId: string
  tribunalId: string
  onSelectCandidate: (candidateId: string, contextParams: URLSearchParams) => void
}

export function CandidateResultsSection({
  convocationId,
  specialityId,
  tribunalId,
  onSelectCandidate,
}: CandidateResultsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const search = searchParams.get('q') ?? ''
  const sort = parseSort(searchParams.get('sort'))
  const page = Number(searchParams.get('page') ?? '0')

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
    next.delete('page')
    setSearchParams(next, { replace: true })
  }, [debouncedSearch, search, searchParams, setSearchParams])

  const { data, isLoading, isPlaceholderData, isError, refetch } = useCandidateList({
    convocationId,
    specialityId,
    tribunalId,
    search: search || undefined,
    sort: serializeSort(sort),
    page,
    size: CANDIDATE_LIST_PAGE_SIZE,
  })

  function updatePage(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    if (nextPage) {
      next.set('page', String(nextPage))
    } else {
      next.delete('page')
    }
    setSearchParams(next)
  }

  function handleSortChange(columnId: string) {
    const updated = nextSort(sort, columnId)
    const next = new URLSearchParams(searchParams)
    const serialized = serializeSort(updated)
    if (serialized) {
      next.set('sort', serialized)
    } else {
      next.delete('sort')
    }
    next.delete('page')
    setSearchParams(next)
  }

  function handleSelectCandidate(candidateId: string) {
    const context = new URLSearchParams({ convocationId, specialityId, tribunalId })
    if (search) context.set('q', search)
    const serializedSort = serializeSort(sort)
    if (serializedSort) context.set('sort', serializedSort)
    if (page) context.set('page', String(page))
    onSelectCandidate(candidateId, context)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <CandidateSearch value={searchInput} onChange={setSearchInput} />
        {data && <ResultsCount totalCount={data.totalCount} />}
      </div>

      {isLoading && <TableSkeleton />}

      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <StateMessage
          title={
            search
              ? `No se han encontrado aspirantes que coincidan con "${search}".`
              : 'No hay aspirantes para los filtros seleccionados.'
          }
        />
      )}

      {data && data.items.length > 0 && (
        <div className={isPlaceholderData ? 'opacity-60 transition-opacity' : ''}>
          <CandidateTable
            columns={data.columns}
            items={data.items}
            sort={sort}
            onSortChange={handleSortChange}
            onSelectCandidate={handleSelectCandidate}
          />
          <Pagination page={data.page} totalPages={data.totalPages} onPageChange={updatePage} />
        </div>
      )}
    </div>
  )
}
