interface CandidateNavigationProps {
  previousId: number | null
  nextId: number | null
  onNavigate: (id: number) => void
}

export function CandidateNavigation({ previousId, nextId, onNavigate }: CandidateNavigationProps) {
  if (!previousId && !nextId) {
    return null
  }

  return (
    <nav
      aria-label="Navegación entre aspirantes"
      className="flex items-center justify-between border-t border-slate-200 pt-4"
    >
      <button
        type="button"
        disabled={!previousId}
        onClick={() => previousId && onNavigate(previousId)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        ← Aspirante anterior
      </button>
      <button
        type="button"
        disabled={!nextId}
        onClick={() => nextId && onNavigate(nextId)}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        Aspirante siguiente →
      </button>
    </nav>
  )
}
