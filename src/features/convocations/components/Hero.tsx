export function Hero() {
  return (
    <section className="flex flex-col gap-4 py-6 text-center sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        Todos los resultados de la oposición, en un solo lugar
      </h1>
      <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">
        Consulta aspirantes, notas y resultados por convocatoria, especialidad y tribunal. Ordena
        los datos, encuentra rápidamente a cualquier candidato y consulta el detalle completo de
        sus resultados.
      </p>
      <a
        href="#consultar"
        className="mx-auto mt-2 inline-flex w-fit items-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700"
      >
        Consultar resultados
      </a>
    </section>
  )
}
