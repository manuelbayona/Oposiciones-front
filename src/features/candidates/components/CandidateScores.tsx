import { formatScore } from '../../../shared/utils/format'
import type { ScoreSection } from '../model/candidate'

export function CandidateScores({ sections }: { sections: ScoreSection[] }) {
  if (sections.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section) => (
        <section key={section.key} className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
            {section.label}
          </h2>
          <dl className="flex flex-col gap-2">
            {section.items.map((item) => (
              <div key={item.key} className="flex items-baseline justify-between text-sm">
                <dt className="text-slate-600">{item.label}</dt>
                <dd className="font-medium tabular-nums text-slate-900">
                  {formatScore(item.value)}
                </dd>
              </div>
            ))}
            {section.total && (
              <div className="mt-1 flex items-baseline justify-between border-t border-slate-100 pt-2 text-sm font-semibold">
                <dt className="text-slate-800">{section.total.label}</dt>
                <dd className="tabular-nums text-slate-900">{formatScore(section.total.value)}</dd>
              </div>
            )}
          </dl>
        </section>
      ))}
    </div>
  )
}
