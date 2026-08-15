import { formatScore } from '../../../shared/utils/format'
import type { ExamResultItem } from '../model/candidate'

/**
 * `attendanceStatus` is displayed verbatim, never color-coded as pass/fail — this frontend
 * never decides business logic (pass/fail, final score, plaza) per the project's own principle;
 * that judgement belongs to the source document, not to a badge we invent here.
 */
function AttendanceLabel({ attendanceStatus }: { attendanceStatus: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
      {attendanceStatus}
    </span>
  )
}

export function CandidateExamResults({ results }: { results: ExamResultItem[] }) {
  if (results.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Calificaciones
        </h2>
        <p className="text-sm text-slate-400">—</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Calificaciones
      </h2>
      <ul className="flex flex-col gap-4">
        {results.map((result) => (
          <li
            key={`${result.sourceDocument}-${result.accessCode}`}
            className="flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm first:border-0 first:pt-0"
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium text-slate-900">{result.examName}</p>
              <AttendanceLabel attendanceStatus={result.attendanceStatus} />
              {!result.valid && (
                <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Con incidencias de validación
                </span>
              )}
            </div>
            <p className="text-slate-600">
              {result.specialty} · Tribunal {result.tribunalNumber}
            </p>
            <dl className="flex flex-col gap-1.5">
              {result.parts.map((part) => (
                <div key={part.partCode} className="flex items-baseline justify-between">
                  <dt className="text-slate-600">Parte {part.partCode}</dt>
                  <dd className="font-medium tabular-nums text-slate-900">
                    {formatScore(part.score.value)}
                  </dd>
                </div>
              ))}
              {result.totalScore.rawValue !== '' && (
                <div className="flex items-baseline justify-between border-t border-slate-100 pt-1.5 font-semibold">
                  <dt className="text-slate-800">Nota total</dt>
                  <dd className="tabular-nums text-slate-900">
                    {formatScore(result.totalScore.value)}
                  </dd>
                </div>
              )}
            </dl>
            <p className="text-xs text-slate-400">Fuente: {result.sourceDocument}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
