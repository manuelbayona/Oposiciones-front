import content from '../../../content/homepage/value-props.json'

export function ValueProps() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-slate-900">{content.heading}</h2>
        <p className="mx-auto mt-2 max-w-2xl text-slate-600">{content.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {content.items.map((item) => (
          <div key={item.title} className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-1.5 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
