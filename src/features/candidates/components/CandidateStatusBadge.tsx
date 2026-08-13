import { candidateStatusLabel, type CandidateStatus } from '../model/candidateStatus'

const STATUS_STYLES: Record<CandidateStatus, string> = {
  EVALUATED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  PENDING: 'bg-slate-50 text-slate-600 border-slate-200',
  NOT_PRESENTED: 'bg-slate-50 text-slate-600 border-slate-200',
  NOT_EVALUATED: 'bg-slate-50 text-slate-600 border-slate-200',
  FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
  EXCLUDED: 'bg-rose-50 text-rose-700 border-rose-200',
}

export function CandidateStatusBadge({ status }: { status: CandidateStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {candidateStatusLabel(status)}
    </span>
  )
}

export function PlacementBadge({ hasPosition }: { hasPosition: boolean | null }) {
  if (hasPosition === null) {
    return <span className="text-sm text-slate-400">—</span>
  }
  return hasPosition ? (
    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
      Plaza
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
      Sin plaza
    </span>
  )
}
