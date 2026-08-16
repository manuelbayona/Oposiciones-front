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

/**
 * Formats a rank/position using Spanish thousands separators (e.g. "3.430"). Built manually
 * rather than via Intl.NumberFormat('es-ES') - that locale's grouping separator is unreliably
 * supported across ICU data builds (confirmed missing in this project's Node test runtime, even
 * though the same runtime groups other locales correctly), which would make this rendering
 * differ between the test environment and a real browser.
 */
export function formatPosition(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return '—'
  }
  return Math.trunc(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
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
