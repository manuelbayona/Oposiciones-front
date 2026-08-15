import { apiGet } from '../../../shared/api/client'
import type {
  CandidateParticipationsResponse,
  CandidateResultsResponse,
  CandidateSearchParams,
  CandidateSummary,
} from '../model/candidate'
import type { CandidateInterinosResponse } from '../../interinos/model/interinos'

export function searchCandidates(params: CandidateSearchParams): Promise<CandidateSummary[]> {
  return apiGet<CandidateSummary[]>('/candidates', {
    name: params.name,
    specialty: params.specialty,
    tribunalNumber: params.tribunalNumber,
    convocationYear: params.convocationYear,
  })
}

export function fetchCandidateResults(id: number): Promise<CandidateResultsResponse> {
  return apiGet<CandidateResultsResponse>(`/candidates/${id}/results`)
}

export function fetchCandidateParticipations(id: number): Promise<CandidateParticipationsResponse> {
  return apiGet<CandidateParticipationsResponse>(`/candidates/${id}/participations`)
}

export function fetchCandidateInterinos(id: number): Promise<CandidateInterinosResponse> {
  return apiGet<CandidateInterinosResponse>(`/candidates/${id}/interinos`)
}
