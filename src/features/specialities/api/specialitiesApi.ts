import { apiGet } from '../../../shared/api/client'
import type { Specialty } from '../model'

export function fetchSpecialties(convocationYear: string): Promise<Specialty[]> {
  return apiGet<Specialty[]>('/participations/specialties', { convocationYear })
}
