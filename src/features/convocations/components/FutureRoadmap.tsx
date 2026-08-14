const UPCOMING_FEATURES = [
  'Comparación de resultados con convocatorias anteriores.',
  'Evolución de las notas de cada aspirante.',
  'Evolución de méritos.',
  'Posición obtenida en cada convocatoria.',
  'Identificación de aspirantes que han obtenido plaza.',
  'Posición en las listas de interinos.',
  'Evolución histórica dentro de las listas de interinidad.',
  'Distancia respecto a la última plaza obtenida.',
  'Estadísticas por tribunal y especialidad.',
]

export function FutureRoadmap() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Una oposición no empieza ni termina en una convocatoria
        </h2>
        <div className="mt-3 flex flex-col gap-2 text-slate-600">
          <p>Una nota aislada cuenta solo una parte de la historia.</p>
          <p>
            A medida que incorporemos más convocatorias, OpoData permitirá conocer la evolución de
            cada aspirante a lo largo de los años.
          </p>
          <p>
            Podrás consultar cómo han cambiado sus resultados, sus méritos y su posición y entender
            mucho mejor su evolución dentro del proceso de oposición.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">
          La plataforma está diseñada para incorporar progresivamente nuevas fuentes de
          información.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-900">Entre las próximas funcionalidades:</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
          {UPCOMING_FEATURES.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span aria-hidden="true" className="text-slate-400">
                &middot;
              </span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
