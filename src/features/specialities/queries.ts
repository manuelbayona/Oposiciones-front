import { useQuery } from '@tanstack/react-query'
import { fetchSpecialities } from './api/specialitiesApi'

export function useSpecialities(convocationId: string | undefined) {
  return useQuery({
    queryKey: ['specialities', convocationId],
    queryFn: () => fetchSpecialities(convocationId!),
    enabled: Boolean(convocationId),
    staleTime: 5 * 60 * 1000,
  })
}
