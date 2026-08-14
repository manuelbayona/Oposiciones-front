const EVOLUTION_ROWS = [
  { label: 'Nota oposición', values: ['7,34', '8,12', '8,42'] },
  { label: 'Méritos', values: ['4,10', '5,03', '6,20'] },
  { label: 'Posición', values: ['534', '283', '117'] },
  { label: 'Lista de interinos', values: ['812', '421', '196'] },
]

export function EvolutionPreview() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-slate-900">¿Cómo ha evolucionado un aspirante?</h2>
        <p className="mt-2 text-slate-600">En futuras versiones podrás pasar de ver únicamente:</p>
      </div>

      <div className="mx-auto w-fit rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700">
        Oposición 2026 &middot; Nota: 8,42
      </div>

      <p className="text-center text-slate-600">a disponer de una visión como:</p>

      <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          2022 &rarr; 2024 &rarr; 2026
        </p>
        <dl className="mt-4 flex flex-col divide-y divide-slate-100">
          {EVOLUTION_ROWS.map((row) => (
            <div key={row.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:justify-between">
              <dt className="text-sm text-slate-600">{row.label}</dt>
              <dd className="font-mono text-sm font-medium text-slate-900">
                {row.values.join(' → ')}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center gap-1 text-center">
        <p className="text-slate-600">Una forma mucho más completa de entender la situación real de cada aspirante.</p>
        <p className="text-xs text-slate-400">Ejemplo ilustrativo de una funcionalidad todavía en desarrollo.</p>
      </div>
    </section>
  )
}
