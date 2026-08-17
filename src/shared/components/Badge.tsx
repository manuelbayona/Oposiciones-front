export type BadgeTone = 'neutral' | 'positive' | 'negative' | 'info' | 'warning'

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'border-slate-200 bg-white text-slate-600',
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  negative: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
}

interface BadgeProps {
  tone: BadgeTone
  title?: string
  children: React.ReactNode
}

/** A small status pill. Pick the `tone` that matches the badge's meaning, not its color. */
export function Badge({ tone, title, children }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  )
}
