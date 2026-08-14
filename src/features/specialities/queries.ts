import { useQuery } from '@tanstack/react-query'
import { fetchSpecialties } from './api/specialitiesApi'

export function useSpecialties(convocationYear: string | undefined) {
  return useQuery({
    queryKey: ['specialties', convocationYear],
    queryFn: () => fetchSpecialties(convocationYear!),
    enabled: Boolean(convocationYear),
    staleTime: 5 * 60 * 1000,
  })
}
