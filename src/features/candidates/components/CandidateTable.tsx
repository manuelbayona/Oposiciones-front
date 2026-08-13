import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { buildCandidateColumns } from './candidateColumns'
import { CandidateTableHeader } from './CandidateTableHeader'
import { CandidateRow } from './CandidateRow'
import type { CandidateListColumn, CandidateSummary } from '../model/candidate'
import type { CandidateSort } from '../model/sort'

interface CandidateTableProps {
  columns: CandidateListColumn[]
  items: CandidateSummary[]
  sort: CandidateSort | null
  onSortChange: (columnId: string) => void
  onSelectCandidate: (candidateId: string) => void
}

export function CandidateTable({
  columns,
  items,
  sort,
  onSortChange,
  onSelectCandidate,
}: CandidateTableProps) {
  const showPlacement = items.some((item) => item.hasPosition !== null)
  const tableColumns = buildCandidateColumns(columns, showPlacement)

  const table = useReactTable({
    data: items,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-max border-collapse">
        <thead className="border-b border-slate-200 bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <CandidateTableHeader
                  key={header.id}
                  columnId={header.column.id}
                  label={String(header.column.columnDef.header)}
                  sortable={Boolean(header.column.columnDef.meta?.sortable)}
                  align={header.column.columnDef.meta?.align ?? 'left'}
                  activeSort={sort}
                  onSort={onSortChange}
                />
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <CandidateRow key={row.id} row={row} onSelect={onSelectCandidate} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
