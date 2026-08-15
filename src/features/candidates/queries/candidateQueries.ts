import { useQuery } from '@tanstack/react-query'
import {
  fetchCandidateInterinos,
  fetchCandidateParticipations,
  fetchCandidateResults,
  searchCandidates,
} from '../api/candidatesApi'
import type { CandidateSearchParams } from '../model/candidate'

export function candidateSearchQueryKey(params: CandidateSearchParams) {
  return ['candidates', params] as const
}

export function useCandidateSearch(params: CandidateSearchParams | undefined) {
  return useQuery({
    queryKey: candidateSearchQueryKey(params ?? {}),
    queryFn: () => searchCandidates(params!),
    enabled: Boolean(params),
  })
}

export function useCandidateResults(id: number | undefined) {
  return useQuery({
    queryKey: ['candidateResults', id],
    queryFn: () => fetchCandidateResults(id!),
    enabled: id !== undefined,
  })
}

export function useCandidateParticipations(id: number | undefined) {
  return useQuery({
    queryKey: ['candidateParticipations', id],
    queryFn: () => fetchCandidateParticipations(id!),
    enabled: id !== undefined,
  })
}

export function useCandidateInterinos(id: number | undefined) {
  return useQuery({
    queryKey: ['candidateInterinos', id],
    queryFn: () => fetchCandidateInterinos(id!),
    enabled: id !== undefined,
  })
}
