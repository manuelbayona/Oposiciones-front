import { apiGet } from '../../../shared/api/client'
import type { Speciality } from '../model'

export function fetchSpecialities(convocationId: string): Promise<Speciality[]> {
  return apiGet<Speciality[]>(`/convocations/${convocationId}/specialities`)
}
