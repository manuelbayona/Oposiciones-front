import type { CandidateStatus } from './candidateStatus'

export interface CandidateListColumn {
  key: string
  label: string
  sortable: boolean
}

export interface CandidateSummary {
  id: string
  position: number | null
  fullName: string
  status: CandidateStatus
  /** Dynamic score values keyed by CandidateListColumn.key, e.g. "partA", "oppositionScore", "finalScore". */
  scores: Record<string, number | null>
  hasPosition: boolean | null
}

export interface CandidateListResponse {
  columns: CandidateListColumn[]
  items: CandidateSummary[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CandidateListParams {
  convocationId: string
  specialityId: string
  tribunalId: string
  search?: string
  sort?: string
  page?: number
  size?: number
}

export interface ScoreItem {
  key: string
  label: string
  value: number | null
  status?: CandidateStatus
}

export interface ScoreSection {
  key: string
  label: string
  items: ScoreItem[]
  total: ScoreItem | null
}

export interface MeritItem {
  key: string
  label: string
  value: number | null
  children?: MeritItem[]
}

export interface CandidateResult {
  oppositionScore: number | null
  meritsScore: number | null
  finalScore: number | null
  position: number | null
  hasPosition: boolean | null
}

export interface CandidateSource {
  title: string
  date: string | null
}

export interface CandidateContext {
  id: string
  name: string
}

export interface CandidateDetail {
  id: string
  fullName: string
  convocation: CandidateContext
  speciality: CandidateContext
  tribunal: CandidateContext
  status: CandidateStatus
  scoreSections: ScoreSection[]
  merits: MeritItem[] | null
  meritsTotal: number | null
  result: CandidateResult
  source: CandidateSource | null
}
