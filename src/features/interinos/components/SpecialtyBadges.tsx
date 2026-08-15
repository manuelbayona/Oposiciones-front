import type { SpecialtyLegend } from '../model/interinos'

interface SpecialtyBadgesProps {
  codes: string[]
  specialtyLegend: SpecialtyLegend | undefined
}

/** A candidate can be accredited in several specialties at once — one badge per code. */
export function SpecialtyBadges({ codes, specialtyLegend }: SpecialtyBadgesProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {codes.map((code) => (
        <span
          key={code}
          className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600"
          title={code}
        >
          {specialtyLegend?.[code] ?? code}
        </span>
      ))}
    </div>
  )
}
