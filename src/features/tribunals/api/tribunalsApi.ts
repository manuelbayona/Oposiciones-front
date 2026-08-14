import { apiGet } from '../../../shared/api/client'
import type { TribunalNumber } from '../model'

export function fetchTribunalNumbers(
  convocationYear: string,
  specialty: string,
): Promise<TribunalNumber[]> {
  return apiGet<TribunalNumber[]>('/participations/tribunal-numbers', {
    convocationYear,
    specialty,
  })
}
