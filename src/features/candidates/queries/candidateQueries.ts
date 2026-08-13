import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchCandidate, fetchCandidates } from '../api/candidatesApi'
import type { CandidateListParams } from '../model/candidate'

export function candidateListQueryKey(params: CandidateListParams) {
  return ['candidates', params] as const
}

export function useCandidateList(params: CandidateListParams | undefined) {
  return useQuery({
    queryKey: candidateListQueryKey(params!),
    queryFn: () => fetchCandidates(params!),
    enabled: Boolean(params),
    placeholderData: keepPreviousData,
  })
}

export function useCandidateDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => fetchCandidate(id!),
    enabled: Boolean(id),
  })
}
