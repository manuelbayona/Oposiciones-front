import { apiGet } from '../../../shared/api/client'
import type { ConvocationYear } from '../model'

export function fetchConvocationYears(): Promise<ConvocationYear[]> {
  return apiGet<ConvocationYear[]>('/participations/convocation-years')
}
