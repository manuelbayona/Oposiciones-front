import content from '../../../content/homepage/future-roadmap.json'

export function FutureRoadmap() {
  return (
    <section className="flex flex-col gap-6 py-10">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-2xl font-semibold text-slate-900">{content.heading}</h2>
        <div className="mt-3 flex flex-col gap-2 text-slate-600">
          {content.introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-2xl rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">{content.cardIntro}</p>
        <p className="mt-2 text-sm font-medium text-slate-900">{content.featuresLabel}</p>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-600">
          {content.features.map((feature) => (
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
