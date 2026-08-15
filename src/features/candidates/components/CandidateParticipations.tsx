import { formatScore } from '../../../shared/utils/format'
import type { ParticipationItem } from '../model/candidate'

export function CandidateParticipations({
  participations,
}: {
  participations: ParticipationItem[]
}) {
  if (participations.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Convocatorias
        </h2>
        <p className="text-sm text-slate-400">—</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Convocatorias
      </h2>
      <ul className="flex flex-col gap-3">
        {participations.map((participation) => (
          <li
            key={`${participation.convocationYear}-${participation.specialty}-${participation.tribunalNumber}`}
            className="flex flex-col gap-1 border-t border-slate-100 pt-3 text-sm first:border-0 first:pt-0"
          >
            <p className="font-medium text-slate-900">
              {participation.convocationCode ?? participation.convocationYear} ·{' '}
              {participation.body}
            </p>
            <p className="text-slate-600">
              {participation.specialty} · Tribunal {participation.tribunalNumber}
            </p>
            <div className="flex items-baseline justify-between">
              <dt className="text-slate-600">Nota de méritos</dt>
              <dd className="font-medium tabular-nums text-slate-900">
                {formatScore(participation.totalMeritScore)}
              </dd>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
