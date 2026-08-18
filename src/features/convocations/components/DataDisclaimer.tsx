import content from '../../../content/homepage/disclaimer.json'

export function DataDisclaimer() {
  return (
    <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-sm font-semibold text-slate-900">{content.heading}</h3>
      {content.paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-2 text-sm text-slate-600">
          {paragraph}
        </p>
      ))}
    </section>
  )
}
