import { formatDate } from '../../../shared/utils/format'
import type { CandidateSource } from '../model/candidate'

export function CandidateSourceInfo({ source }: { source: CandidateSource }) {
  return (
    <p className="text-xs text-slate-400">
      Fuente: {source.title}
      {source.date && ` · ${formatDate(source.date)}`}
    </p>
  )
}
