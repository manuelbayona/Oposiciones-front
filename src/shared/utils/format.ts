const scoreFormatter = new Intl.NumberFormat('es-ES', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Formats a score using Spanish locale conventions (comma decimal separator). */
export function formatScore(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—'
  }
  return scoreFormatter.format(value)
}

export function formatPosition(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—'
  }
  return String(value)
}

const dateFormatter = new Intl.DateTimeFormat('es-ES', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '—'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return '—'
  }
  return dateFormatter.format(date)
}
