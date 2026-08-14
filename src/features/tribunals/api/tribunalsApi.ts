import { apiGet } from '../../../shared/api/client'
import type { Tribunal } from '../model'

export function fetchTribunals(convocationId: string, specialityId: string): Promise<Tribunal[]> {
  return apiGet<Tribunal[]>(`/convocations/${convocationId}/specialities/${specialityId}/tribunals`)
}
