import type { ColumnDef } from '@tanstack/react-table'
import type { CandidateListColumn, CandidateSummary } from '../model/candidate'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    sortable?: boolean
    align?: 'left' | 'right'
  }
}

export function buildCandidateColumns(
  dynamicColumns: CandidateListColumn[],
  showPlacement: boolean,
): ColumnDef<CandidateSummary>[] {
  const columns: ColumnDef<CandidateSummary>[] = [
    {
      id: 'position',
      header: 'Pos.',
      accessorFn: (row) => row.position,
      meta: { sortable: true, align: 'right' },
    },
    {
      id: 'fullName',
      header: 'Aspirante',
      accessorFn: (row) => row.fullName,
      meta: { sortable: true, align: 'left' },
    },
    ...dynamicColumns.map((column): ColumnDef<CandidateSummary> => ({
      id: column.key,
      header: column.label,
      accessorFn: (row) => row.scores[column.key] ?? null,
      meta: { sortable: column.sortable, align: 'right' },
    })),
  ]

  if (showPlacement) {
    columns.push({
      id: 'hasPosition',
      header: 'Resultado',
      accessorFn: (row) => row.hasPosition,
      meta: { sortable: false, align: 'left' },
    })
  }

  return columns
}
