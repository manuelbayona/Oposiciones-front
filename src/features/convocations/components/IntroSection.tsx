import content from '../../../content/homepage/intro.json'

export function IntroSection() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-3 py-4 text-center text-slate-600">
      {content.paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </section>
  )
}
