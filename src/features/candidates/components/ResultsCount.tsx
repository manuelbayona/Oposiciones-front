interface ResultsCountProps {
  totalCount: number
}

export function ResultsCount({ totalCount }: ResultsCountProps) {
  const label = totalCount === 1 ? 'aspirante' : 'aspirantes'

  return (
    <p className="text-sm text-slate-600">
      {totalCount} {label}
    </p>
  )
}
