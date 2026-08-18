import content from '../../../content/homepage/hero.json'

export function Hero() {
  return (
    <section className="flex flex-col gap-4 py-6 text-center sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
        {content.title}
      </h1>
      <p className="mx-auto max-w-2xl text-base text-slate-600 sm:text-lg">{content.subtitle}</p>
      <a
        href={content.ctaHref}
        className="mx-auto mt-2 inline-flex w-fit items-center rounded-md bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-700"
      >
        {content.ctaLabel}
      </a>
    </section>
  )
}
