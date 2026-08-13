import type { Row } from '@tanstack/react-table'
import { formatPosition, formatScore } from '../../../shared/utils/format'
import { PlacementBadge } from './CandidateStatusBadge'
import type { CandidateSummary } from '../model/candidate'

interface CandidateRowProps {
  row: Row<CandidateSummary>
  onSelect: (candidateId: string) => void
}

function renderCellValue(columnId: string, value: unknown) {
  if (columnId === 'position') {
    return formatPosition(value as number | null)
  }
  if (columnId === 'fullName') {
    return value as string
  }
  if (columnId === 'hasPosition') {
    return <PlacementBadge hasPosition={value as boolean | null} />
  }
  return formatScore(value as number | null)
}

export function CandidateRow({ row, onSelect }: CandidateRowProps) {
  const candidate = row.original

  return (
    <tr
      onClick={() => onSelect(candidate.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect(candidate.id)
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Ver detalle de ${candidate.fullName}`}
      className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900"
    >
      {row.getVisibleCells().map((cell) => {
        const align = cell.column.columnDef.meta?.align === 'right' ? 'text-right' : 'text-left'
        return (
          <td key={cell.id} className={`px-3 py-2.5 text-sm text-slate-800 ${align}`}>
            {renderCellValue(cell.column.id, cell.getValue())}
          </td>
        )
      })}
    </tr>
  )
}
