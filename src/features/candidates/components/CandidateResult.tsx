import { formatPosition, formatScore } from '../../../shared/utils/format'
import type { CandidateResult as CandidateResultModel } from '../model/candidate'

export function CandidateResult({ result }: { result: CandidateResultModel }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Resultado
      </h2>
      <dl className="flex flex-col gap-2 text-sm">
        <div className="flex items-baseline justify-between">
          <dt className="text-slate-600">Nota oposición</dt>
          <dd className="font-medium tabular-nums text-slate-900">
            {formatScore(result.oppositionScore)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-slate-600">Méritos</dt>
          <dd className="font-medium tabular-nums text-slate-900">
            {formatScore(result.meritsScore)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-slate-100 pt-2 font-semibold">
          <dt className="text-slate-800">Nota final</dt>
          <dd className="tabular-nums text-slate-900">{formatScore(result.finalScore)}</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-slate-600">Posición</dt>
          <dd className="font-medium tabular-nums text-slate-900">
            {formatPosition(result.position)}
          </dd>
        </div>
        {result.hasPosition !== null && (
          <div className="flex items-baseline justify-between">
            <dt className="text-slate-600">Plaza obtenida</dt>
            <dd className="font-medium text-slate-900">{result.hasPosition ? 'Sí' : 'No'}</dd>
          </div>
        )}
      </dl>
    </section>
  )
}
