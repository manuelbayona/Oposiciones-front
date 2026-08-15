import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import { formatPosition, formatScore } from '../../../shared/utils/format'
import { formatBlock } from '../utils/block'
import { SpecialtyBadges } from './SpecialtyBadges'
import type { InterinosListingEntryItem, SpecialtyLegend } from '../model/interinos'

const columnHelper = createColumnHelper<InterinosListingEntryItem>()

interface InterinosTableProps {
  items: InterinosListingEntryItem[]
  specialtyLegend: SpecialtyLegend | undefined
  specialtyFilterActive: boolean
  onSelectCandidate: (id: number) => void
}

export function InterinosTable({
  items,
  specialtyLegend,
  specialtyFilterActive,
  onSelectCandidate,
}: InterinosTableProps) {
  const columns = useMemo(
    () => [
      columnHelper.accessor('listPosition', {
        header: 'Nº orden',
        cell: (info) => (
          <span className="tabular-nums text-slate-600">{formatPosition(info.getValue())}</span>
        ),
      }),
      columnHelper.accessor('fullName', {
        header: 'Aspirante',
        cell: (info) => <span className="font-medium text-slate-900">{info.getValue()}</span>,
      }),
      columnHelper.accessor('block', {
        header: 'Bloque',
        cell: (info) => (
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
            {formatBlock(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor('accreditedSpecialtyCodes', {
        header: 'Especialidades',
        cell: (info) => (
          <SpecialtyBadges codes={info.getValue()} specialtyLegend={specialtyLegend} />
        ),
      }),
      columnHelper.accessor('totalScore', {
        header: 'Puntuación total',
        cell: (info) => (
          <span className="tabular-nums font-medium text-slate-900">
            {formatScore(info.getValue().value)}
          </span>
        ),
      }),
      ...(specialtyFilterActive
        ? [
            columnHelper.accessor('specialtyRank', {
              header: 'Puesto en la especialidad',
              cell: (info) => (
                <span className="tabular-nums font-medium text-slate-900">
                  {formatPosition(info.getValue())}
                </span>
              ),
            }),
          ]
        : []),
    ],
    [specialtyLegend, specialtyFilterActive],
  )

  const table = useReactTable({ data: items, columns, getCoreRowModel: getCoreRowModel() })

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-max border-collapse">
        <thead className="border-b border-slate-200 bg-slate-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-3 py-2 text-left text-xs font-semibold text-slate-600"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelectCandidate(row.original.candidateId)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectCandidate(row.original.candidateId)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalle de ${row.original.fullName}`}
              className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2.5 text-sm">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
