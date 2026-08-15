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

export function useCandidateResults(maskedIdentifier: string | undefined) {
  return useQuery({
    queryKey: ['candidateResults', maskedIdentifier],
    queryFn: () => fetchCandidateResults(maskedIdentifier!),
    enabled: Boolean(maskedIdentifier),
  })
}

export function useCandidateParticipations(maskedIdentifier: string | undefined) {
  return useQuery({
    queryKey: ['candidateParticipations', maskedIdentifier],
    queryFn: () => fetchCandidateParticipations(maskedIdentifier!),
    enabled: Boolean(maskedIdentifier),
  })
}

export function useCandidateInterinos(maskedIdentifier: string | undefined) {
  return useQuery({
    queryKey: ['candidateInterinos', maskedIdentifier],
    queryFn: () => fetchCandidateInterinos(maskedIdentifier!),
    enabled: Boolean(maskedIdentifier),
  })
}
