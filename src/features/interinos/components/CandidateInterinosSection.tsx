import { formatPosition, formatScore } from '../../../shared/utils/format'
import { formatBlock } from '../utils/block'
import { SpecialtyBadges } from './SpecialtyBadges'
import type { InterinosEntryItem, SpecialtyLegend } from '../model/interinos'

interface CandidateInterinosSectionProps {
  entries: InterinosEntryItem[]
  specialtyLegend: SpecialtyLegend | undefined
}

export function CandidateInterinosSection({
  entries,
  specialtyLegend,
}: CandidateInterinosSectionProps) {
  if (entries.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Listado de interinos
        </h2>
        <p className="text-sm text-slate-400">—</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Listado de interinos
      </h2>
      <ul className="flex flex-col gap-4">
        {entries.map((entry) => (
          <li
            key={`${entry.block}-${entry.listPosition}`}
            className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm first:border-0 first:pt-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900">Nº orden {formatPosition(entry.overallRank)}</p>
              <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                {formatBlock(entry.block)}
              </span>
              {!entry.valid && (
                <span
                  title="El documento oficial publicado no incluye todos los datos de este registro."
                  className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                >
                  Datos incompletos
                </span>
              )}
            </div>

            <SpecialtyBadges
              codes={entry.accreditedSpecialtyCodes}
              specialtyLegend={specialtyLegend}
            />

            <dl className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between font-semibold">
                <dt className="text-slate-800">Puntuación total</dt>
                <dd className="tabular-nums text-slate-900">
                  {formatScore(entry.totalScore.value)}
                </dd>
              </div>
              {entry.highestPassedExamGrade && (
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Nota máxima superada</dt>
                  <dd className="tabular-nums font-medium text-slate-900">
                    {formatScore(entry.highestPassedExamGrade.value)}
                  </dd>
                </div>
              )}
              {entry.pointsFromPassedOppositionsSince2000 && (
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Puntos por oposiciones aprobadas desde 2000</dt>
                  <dd className="tabular-nums font-medium text-slate-900">
                    {formatScore(entry.pointsFromPassedOppositionsSince2000.value)}
                  </dd>
                </div>
              )}
              {entry.currentExamGrade && (
                <div className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Nota de la prueba actual</dt>
                  <dd className="tabular-nums font-medium text-slate-900">
                    {formatScore(entry.currentExamGrade.value)}
                  </dd>
                </div>
              )}
            </dl>

            <details className="text-xs text-slate-500">
              <summary className="cursor-pointer select-none">Experiencia docente</summary>
              <dl className="mt-2 flex flex-col gap-1">
                <div className="flex items-baseline justify-between">
                  <dt>Apartado 1</dt>
                  <dd className="tabular-nums">{formatScore(entry.teachingExperience.b1.value)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt>Apartado 2</dt>
                  <dd className="tabular-nums">{formatScore(entry.teachingExperience.b2.value)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt>Apartado 3</dt>
                  <dd className="tabular-nums">{formatScore(entry.teachingExperience.b3.value)}</dd>
                </div>
                <div className="flex items-baseline justify-between">
                  <dt>Apartado 4</dt>
                  <dd className="tabular-nums">{formatScore(entry.teachingExperience.b4.value)}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-1 font-medium">
                  <dt>Total experiencia docente</dt>
                  <dd className="tabular-nums">
                    {formatScore(entry.teachingExperience.total.value)}
                  </dd>
                </div>
              </dl>
            </details>
          </li>
        ))}
      </ul>
    </section>
  )
}
