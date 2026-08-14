import type { CandidateSort } from '../model/sort'

interface CandidateTableHeaderProps {
  label: string
  columnId: string
  sortable: boolean
  align: 'left' | 'right'
  activeSort: CandidateSort | null
  onSort: (columnId: string) => void
}

export function CandidateTableHeader({
  label,
  columnId,
  sortable,
  align,
  activeSort,
  onSort,
}: CandidateTableHeaderProps) {
  const isActive = activeSort?.key === columnId
  const alignClass = align === 'right' ? 'text-right' : 'text-left'

  if (!sortable) {
    return (
      <th scope="col" className={`px-3 py-2 text-xs font-semibold text-slate-600 ${alignClass}`}>
        {label}
      </th>
    )
  }

  return (
    <th scope="col" className={`px-3 py-2 text-xs font-semibold text-slate-600 ${alignClass}`}>
      <button
        type="button"
        onClick={() => onSort(columnId)}
        aria-sort={
          isActive ? (activeSort!.direction === 'asc' ? 'ascending' : 'descending') : 'none'
        }
        className={`inline-flex items-center gap-1 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
          isActive ? 'text-slate-900' : ''
        } ${align === 'right' ? 'flex-row-reverse' : ''}`}
      >
        {label}
        <span aria-hidden="true" className="text-slate-400">
          {isActive ? (activeSort!.direction === 'asc' ? '↑' : '↓') : '↕'}
        </span>
      </button>
    </th>
  )
}
