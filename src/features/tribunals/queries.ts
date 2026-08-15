import { useQuery } from '@tanstack/react-query'
import { fetchTribunalNumbers } from './api/tribunalsApi'

export function useTribunalNumbers(
  convocationYear: string | undefined,
  specialty: string | undefined,
) {
  return useQuery({
    queryKey: ['tribunalNumbers', convocationYear, specialty],
    queryFn: () => fetchTribunalNumbers(convocationYear!, specialty!),
    enabled: Boolean(convocationYear) && Boolean(specialty),
    staleTime: 5 * 60 * 1000,
  })
}
