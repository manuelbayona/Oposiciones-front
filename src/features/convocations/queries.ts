import { useQuery } from '@tanstack/react-query'
import { fetchConvocationYears } from './api/convocationsApi'

export function useConvocationYears() {
  return useQuery({
    queryKey: ['convocationYears'],
    queryFn: fetchConvocationYears,
    staleTime: 5 * 60 * 1000,
  })
}
