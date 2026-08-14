import { apiGet } from '../../../shared/api/client'
import type { Convocation } from '../model'

export function fetchConvocations(): Promise<Convocation[]> {
  return apiGet<Convocation[]>('/convocations')
}
