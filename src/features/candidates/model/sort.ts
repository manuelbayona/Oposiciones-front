export interface CandidateSort {
  key: string
  direction: 'asc' | 'desc'
}

export function parseSort(sortParam: string | null): CandidateSort | null {
  if (!sortParam) {
    return null
  }
  const [key, direction] = sortParam.split(',')
  if (!key || (direction !== 'asc' && direction !== 'desc')) {
    return null
  }
  return { key, direction }
}

export function serializeSort(sort: CandidateSort | null): string | undefined {
  if (!sort) {
    return undefined
  }
  return `${sort.key},${sort.direction}`
}

/** Cycles asc -> desc -> none when the same column header is clicked repeatedly. */
export function nextSort(current: CandidateSort | null, key: string): CandidateSort | null {
  if (!current || current.key !== key) {
    return { key, direction: 'asc' }
  }
  if (current.direction === 'asc') {
    return { key, direction: 'desc' }
  }
  return null
}
