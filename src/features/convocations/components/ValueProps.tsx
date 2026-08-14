const VALUE_PROPS = [
  {
    title: 'Busca',
    description: 'Encuentra rápidamente a cualquier aspirante por su nombre.',
  },
  {
    title: 'Ordena',
    description: 'Ordena el tribunal por nota, puntuación final, méritos o cualquiera de los datos disponibles.',
  },
  {
    title: 'Consulta',
    description: 'Accede al detalle de cada aspirante y revisa todas las pruebas, calificaciones y méritos publicados.',
  },
]

export function ValueProps() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Toda la convocatoria de un vistazo</h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">
          En lugar de consultar diferentes PDFs y listados oficiales, OpoData estructura la
          información para que puedas navegar fácilmente entre los resultados.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {VALUE_PROPS.map((prop) => (
          <div key={prop.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">{prop.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{prop.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
