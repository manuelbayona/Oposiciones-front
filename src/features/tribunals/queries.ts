import { useQuery } from '@tanstack/react-query'
import { fetchTribunals } from './api/tribunalsApi'

export function useTribunals(convocationId: string | undefined, specialityId: string | undefined) {
  return useQuery({
    queryKey: ['tribunals', convocationId, specialityId],
    queryFn: () => fetchTribunals(convocationId!, specialityId!),
    enabled: Boolean(convocationId) && Boolean(specialityId),
    staleTime: 5 * 60 * 1000,
  })
}
