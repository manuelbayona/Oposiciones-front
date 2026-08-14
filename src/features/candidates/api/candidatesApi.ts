import { apiGet } from '../../../shared/api/client'
import type {
  CandidateDetail,
  CandidateListParams,
  CandidateListResponse,
} from '../model/candidate'

export function fetchCandidates(params: CandidateListParams): Promise<CandidateListResponse> {
  return apiGet<CandidateListResponse>('/candidates', {
    convocationId: params.convocationId,
    specialityId: params.specialityId,
    tribunalId: params.tribunalId,
    search: params.search,
    sort: params.sort,
    page: params.page,
    size: params.size,
  })
}

export function fetchCandidate(id: string): Promise<CandidateDetail> {
  return apiGet<CandidateDetail>(`/candidates/${id}`)
}
