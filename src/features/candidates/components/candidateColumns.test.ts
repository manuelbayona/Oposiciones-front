import { describe, expect, it } from 'vitest'
import { buildCandidateColumns } from './candidateColumns'

const dynamicColumns = [
  { key: 'partA', label: 'Parte A', sortable: true },
  { key: 'finalScore', label: 'Nota final', sortable: true },
]

describe('buildCandidateColumns', () => {
  it('always includes fixed position and name columns first', () => {
    const columns = buildCandidateColumns([], false)
    expect(columns.map((c) => c.id)).toEqual(['position', 'fullName'])
  })

  it('appends the backend-provided dynamic score columns in order', () => {
    const columns = buildCandidateColumns(dynamicColumns, false)
    expect(columns.map((c) => c.id)).toEqual(['position', 'fullName', 'partA', 'finalScore'])
  })

  it('only adds the placement column when requested', () => {
    const withoutPlacement = buildCandidateColumns(dynamicColumns, false)
    const withPlacement = buildCandidateColumns(dynamicColumns, true)
    expect(withoutPlacement.some((c) => c.id === 'hasPosition')).toBe(false)
    expect(withPlacement.some((c) => c.id === 'hasPosition')).toBe(true)
  })

  it('marks non-sortable dynamic columns as such', () => {
    const columns = buildCandidateColumns(
      [{ key: 'notes', label: 'Notas', sortable: false }],
      false,
    )
    const notesColumn = columns.find((c) => c.id === 'notes')
    expect(notesColumn?.meta?.sortable).toBe(false)
  })
})
