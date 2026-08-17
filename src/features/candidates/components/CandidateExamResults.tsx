import { Badge } from '../../../shared/components/Badge'
import { formatScore } from '../../../shared/utils/format'
import type { ExamResultItem, PassStatus } from '../model/candidate'

/**
 * Clean display labels for the phases ExamPhaseClassifier recognises on the backend. The raw
 * `examName` (e.g. "QUE HAN SUPERADO LA PRUEBA ÚNICA Y FASE DE OPOSICIÓN") is publication
 * wording, not a stable label — it varies between a provisional listing, its definitive revision,
 * and a "quienes han superado" listing for what is otherwise the same exam phase.
 */
const PHASE_LABELS: Record<string, string> = {
  primera_prueba: 'Primera prueba',
  segunda_prueba: 'Segunda prueba',
  prueba_unica: 'Prueba única',
  fase_oposicion: 'Fase de oposición',
}

const PHASE_ORDER = Object.keys(PHASE_LABELS)

/** Falls back to the raw examName only for a phase the backend could not classify. */
function phaseLabel(result: ExamResultItem): string {
  return (result.phase && PHASE_LABELS[result.phase]) || result.examName
}

function phaseRank(phase: string | null): number {
  const index = phase ? PHASE_ORDER.indexOf(phase) : -1
  return index === -1 ? PHASE_ORDER.length : index
}

interface ConvocationGroup {
  results: ExamResultItem[]
}

/**
 * Results are grouped by convocation (ascending) and, within each, ordered by exam phase.
 * `convocationYear`/`convocationCode` aren't stored on the group itself — every result in
 * `results` already carries the same values, since that's what the grouping is keyed on.
 */
function groupByConvocation(results: ExamResultItem[]): ConvocationGroup[] {
  const groups = new Map<number, ConvocationGroup>()
  for (const result of results) {
    const group = groups.get(result.convocationYear)
    if (group) {
      group.results.push(result)
    } else {
      groups.set(result.convocationYear, { results: [result] })
    }
  }
  return [...groups.values()]
    .sort((a, b) => a.results[0].convocationYear - b.results[0].convocationYear)
    .map((group) => ({
      results: [...group.results].sort((a, b) => phaseRank(a.phase) - phaseRank(b.phase)),
    }))
}

/**
 * `passStatus` never comes from a threshold this frontend (or the backend) invents — it is set
 * only when the candidate's presence or absence in an official "quienes han superado" listing
 * proves the outcome (see PassStatus on the backend). UNKNOWN means no such listing has been
 * published yet, so nothing is shown rather than a guess.
 */
function PassStatusLabel({ passStatus }: { passStatus: PassStatus }) {
  if (passStatus === 'UNKNOWN') {
    return null
  }
  const isPassed = passStatus === 'PASSED'
  return <Badge tone={isPassed ? 'positive' : 'negative'}>{isPassed ? 'Aprobó' : 'No aprobó'}</Badge>
}

/**
 * Shown only when the source document's header states it explicitly — `null` means the header
 * said neither, so nothing is shown rather than a guess. This is what lets two results for the
 * same phase (a provisional listing and its later correction) appear as distinct entries instead
 * of unlabeled duplicates.
 */
function DefinitiveStatusLabel({ isDefinitive }: { isDefinitive: boolean | null }) {
  if (isDefinitive === null) {
    return null
  }
  return (
    <Badge tone={isDefinitive ? 'info' : 'neutral'}>
      {isDefinitive ? 'Definitiva' : 'Provisional'}
    </Badge>
  )
}

function ExamPhaseResult({ result }: { result: ExamResultItem }) {
  return (
    <li className="flex flex-col gap-2 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-medium text-slate-900">{phaseLabel(result)}</p>
        <DefinitiveStatusLabel isDefinitive={result.isDefinitive} />
        {/* attendanceStatus is displayed verbatim, never color-coded — that reflects only
            whether the candidate showed up, not whether they passed. */}
        <Badge tone="neutral">{result.attendanceStatus}</Badge>
        <PassStatusLabel passStatus={result.passStatus} />
        {!result.valid && (
          <Badge
            tone="warning"
            title="El documento oficial publicado no incluye todos los datos de este resultado."
          >
            Datos incompletos
          </Badge>
        )}
      </div>
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
          <div className="flex items-baseline justify-between border-t border-slate-200 pt-1.5 font-semibold">
            <dt className="text-slate-800">Nota total</dt>
            <dd className="tabular-nums text-slate-900">{formatScore(result.totalScore.value)}</dd>
          </div>
        )}
      </dl>
    </li>
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

  const groups = groupByConvocation(results)

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Calificaciones
      </h2>
      <ul className="flex flex-col gap-5">
        {groups.map((group) => (
          <li
            key={group.results[0].convocationYear}
            className="flex flex-col gap-3 border-t border-slate-100 pt-4 first:border-0 first:pt-0"
          >
            <p className="text-sm font-semibold text-slate-900">
              Convocatoria {group.results[0].convocationCode ?? group.results[0].convocationYear}
            </p>
            <ul className="flex flex-col gap-3">
              {group.results.map((result) => (
                <ExamPhaseResult key={`${result.sourceDocument}-${result.accessCode}`} result={result} />
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
