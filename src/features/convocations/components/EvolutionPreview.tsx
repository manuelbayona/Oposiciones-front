import content from '../../../content/homepage/evolution-preview.json'

export function EvolutionPreview() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-slate-900">{content.heading}</h2>
        <p className="mt-2 text-slate-600">{content.beforeIntro}</p>
      </div>

      <div className="mx-auto w-fit rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700">
        {content.exampleBadge}
      </div>

      <p className="text-center text-slate-600">{content.afterIntro}</p>

      <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {content.columnsLabel}
        </p>
        <dl className="mt-4 flex flex-col divide-y divide-slate-100">
          {content.rows.map((row) => (
            <div
              key={row.label}
              className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <dt className="text-sm text-slate-600">{row.label}</dt>
              <dd className="font-mono text-sm font-medium text-slate-900">
                {row.values.join(' → ')}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-1 text-center">
        <p className="text-slate-600">{content.footerText}</p>
        <p className="text-xs text-slate-400">{content.footerNote}</p>
      </div>
    </section>
  )
}
