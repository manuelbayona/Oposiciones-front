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

export function fetchCandidateResults(maskedIdentifier: string): Promise<CandidateResultsResponse> {
  return apiGet<CandidateResultsResponse>(
    `/candidates/${encodeURIComponent(maskedIdentifier)}/results`,
  )
}

export function fetchCandidateParticipations(
  maskedIdentifier: string,
): Promise<CandidateParticipationsResponse> {
  return apiGet<CandidateParticipationsResponse>(
    `/candidates/${encodeURIComponent(maskedIdentifier)}/participations`,
  )
}

export function fetchCandidateInterinos(
  maskedIdentifier: string,
): Promise<CandidateInterinosResponse> {
  return apiGet<CandidateInterinosResponse>(
    `/candidates/${encodeURIComponent(maskedIdentifier)}/interinos`,
  )
}
