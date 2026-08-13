export type CandidateStatus =
  'EVALUATED' | 'PENDING' | 'NOT_PRESENTED' | 'NOT_EVALUATED' | 'FAILED' | 'EXCLUDED'

const STATUS_LABELS: Record<CandidateStatus, string> = {
  EVALUATED: 'Evaluado',
  PENDING: 'Pendiente',
  NOT_PRESENTED: 'No presentado',
  NOT_EVALUATED: 'No evaluado',
  FAILED: 'Suspendido',
  EXCLUDED: 'Excluido',
}

export function candidateStatusLabel(status: CandidateStatus): string {
  return STATUS_LABELS[status] ?? status
}

export function isCandidateStatusEvaluated(status: CandidateStatus): boolean {
  return status === 'EVALUATED'
}
