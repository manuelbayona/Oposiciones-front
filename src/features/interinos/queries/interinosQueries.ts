import { useQuery } from '@tanstack/react-query'
import { fetchInterinosSpecialtyLegend, searchInterinos } from '../api/interinosApi'
import type { InterinosSearchParams } from '../model/interinos'

export function useInterinosSearch(params: InterinosSearchParams) {
  return useQuery({
    queryKey: ['interinos', params],
    queryFn: () => searchInterinos(params),
  })
}

export function useInterinosSpecialtyLegend() {
  return useQuery({
    queryKey: ['interinosSpecialtyLegend'],
    queryFn: fetchInterinosSpecialtyLegend,
    staleTime: Infinity,
  })
}
