import { formatScore } from '../../../shared/utils/format'
import type { MeritItem } from '../model/candidate'

function MeritRow({ item, depth }: { item: MeritItem; depth: number }) {
  return (
    <>
      <div
        className="flex items-baseline justify-between text-sm"
        style={{ paddingLeft: depth * 16 }}
      >
        <dt className={depth === 0 ? 'text-slate-600' : 'text-slate-500'}>{item.label}</dt>
        <dd className="font-medium tabular-nums text-slate-900">{formatScore(item.value)}</dd>
      </div>
      {item.children?.map((child) => (
        <MeritRow key={child.key} item={child} depth={depth + 1} />
      ))}
    </>
  )
}

interface CandidateMeritsProps {
  merits: MeritItem[] | null
  total: number | null
}

export function CandidateMerits({ merits, total }: CandidateMeritsProps) {
  if (!merits || merits.length === 0) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Méritos
        </h2>
        <p className="text-sm text-slate-400">—</p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Méritos</h2>
      <dl className="flex flex-col gap-2">
        {merits.map((item) => (
          <MeritRow key={item.key} item={item} depth={0} />
        ))}
        <div className="mt-1 flex items-baseline justify-between border-t border-slate-100 pt-2 text-sm font-semibold">
          <dt className="text-slate-800">Total méritos</dt>
          <dd className="tabular-nums text-slate-900">{formatScore(total)}</dd>
        </div>
      </dl>
    </section>
  )
}
