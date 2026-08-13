interface CandidateSearchProps {
  value: string
  onChange: (value: string) => void
}

export function CandidateSearch({ value, onChange }: CandidateSearchProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="candidate-search" className="text-xs font-medium text-slate-600">
        Buscar aspirante
      </label>
      <input
        id="candidate-search"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nombre del aspirante…"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 sm:w-72"
      />
    </div>
  )
}
