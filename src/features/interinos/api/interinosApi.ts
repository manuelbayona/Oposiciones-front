import { apiGet } from '../../../shared/api/client'
import type {
  InterinosSearchParams,
  InterinosSearchResponse,
  SpecialtyLegend,
} from '../model/interinos'

export function searchInterinos(params: InterinosSearchParams): Promise<InterinosSearchResponse> {
  return apiGet<InterinosSearchResponse>('/interinos', {
    block: params.block,
    specialtyCode: params.specialtyCode,
    page: params.page,
    size: params.size,
  })
}

export function fetchInterinosSpecialtyLegend(): Promise<SpecialtyLegend> {
  return apiGet<SpecialtyLegend>('/interinos/specialties')
}
