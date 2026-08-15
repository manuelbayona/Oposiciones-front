import type { CandidateSummary } from '../model/candidate'

interface CandidateTableProps {
  items: CandidateSummary[]
  onSelectCandidate: (id: number) => void
}

export function CandidateTable({ items, onSelectCandidate }: CandidateTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
      <table className="w-full min-w-max border-collapse">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold text-slate-600">
              Aspirante
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((candidate) => (
            <tr
              key={candidate.id}
              onClick={() => onSelectCandidate(candidate.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelectCandidate(candidate.id)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`Ver detalle de ${candidate.fullName}`}
              className="cursor-pointer border-b border-slate-100 last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-slate-900"
            >
              <td className="px-3 py-2.5 text-sm text-slate-800">{candidate.fullName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
