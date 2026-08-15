import { useNavigate, useSearchParams } from 'react-router-dom'
import { InterinosFilters } from '../components/InterinosFilters'
import { InterinosTable } from '../components/InterinosTable'
import { useInterinosSearch, useInterinosSpecialtyLegend } from '../queries/interinosQueries'
import { ResultsCount } from '../../candidates/components/ResultsCount'
import { Pagination } from '../../../shared/components/Pagination'
import { TableSkeleton } from '../../../shared/components/Skeleton'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'

const PAGE_SIZE = 50

export function InterinosListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const block = searchParams.get('block') ?? ''
  const specialtyCode = searchParams.get('specialtyCode') ?? ''
  const page = Number(searchParams.get('page') ?? '0')

  const { data: specialtyLegend, isLoading: specialtyLegendLoading } = useInterinosSpecialtyLegend()
  const { data, isLoading, isError, refetch } = useInterinosSearch({
    block: block || undefined,
    specialtyCode: specialtyCode || undefined,
    page,
    size: PAGE_SIZE,
  })

  function updateFilter(key: 'block' | 'specialtyCode', value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    next.delete('page')
    setSearchParams(next)
  }

  function handlePageChange(nextPage: number) {
    const next = new URLSearchParams(searchParams)
    if (nextPage > 0) {
      next.set('page', String(nextPage))
    } else {
      next.delete('page')
    }
    setSearchParams(next)
  }

  function handleSelectCandidate(id: number) {
    const context = new URLSearchParams({ from: 'interinos' })
    if (block) context.set('interinosBlock', block)
    if (specialtyCode) context.set('interinosSpecialtyCode', specialtyCode)
    if (page) context.set('interinosPage', String(page))
    navigate(`/candidates/${id}?${context.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-slate-900">Listado de interinos</h1>
        <p className="text-sm text-slate-500">
          Listado definitivo de aspirantes para sustituciones, por orden de puntuación dentro de
          cada bloque.
        </p>
      </header>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <InterinosFilters
          block={block}
          specialtyCode={specialtyCode}
          specialtyLegend={specialtyLegend}
          specialtyLegendLoading={specialtyLegendLoading}
          onBlockChange={(value) => updateFilter('block', value)}
          onSpecialtyCodeChange={(value) => updateFilter('specialtyCode', value)}
        />
        {data && <ResultsCount totalCount={data.totalElements} />}
      </div>

      {isLoading && <TableSkeleton columns={5} />}

      {isError && <ErrorMessage onRetry={() => refetch()} />}

      {data && data.items.length === 0 && (
        <StateMessage title="No hay aspirantes para los filtros seleccionados." />
      )}

      {data && data.items.length > 0 && (
        <>
          <InterinosTable
            items={data.items}
            specialtyLegend={specialtyLegend}
            onSelectCandidate={handleSelectCandidate}
          />
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}
