interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index)

  return (
    <nav
      aria-label="Paginación de aspirantes"
      className="flex items-center justify-center gap-1 py-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        Anterior
      </button>
      {pages.map((pageIndex) => (
        <button
          key={pageIndex}
          type="button"
          aria-current={pageIndex === page ? 'page' : undefined}
          onClick={() => onPageChange(pageIndex)}
          className={`h-8 w-8 rounded-md text-sm ${
            pageIndex === page ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {pageIndex + 1}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="rounded-md px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
      >
        Siguiente
      </button>
    </nav>
  )
}
