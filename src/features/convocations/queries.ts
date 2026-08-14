import { useQuery } from '@tanstack/react-query'
import { fetchConvocations } from './api/convocationsApi'

export function useConvocations() {
  return useQuery({
    queryKey: ['convocations'],
    queryFn: fetchConvocations,
    staleTime: 5 * 60 * 1000,
  })
}
