/** Matches GET /api/v1/candidates — search-by-name result, per CandidateSummaryResponse. */
export interface CandidateSummary {
  id: number
  maskedIdentifier: string
  fullName: string
}

export interface CandidateSearchParams {
  name?: string
  specialty?: string
  tribunalNumber?: string
  convocationYear?: number
}

/** A single score, kept as both the raw source text and its normalized numeric form — see ScoreValue on the backend. */
export interface ScoreItem {
  rawValue: string
  value: number | null
}

/** One part's score within an exam result (e.g. "A"/"B" for a two-part exam, "unica" for a single-mark one) — see ADR-007 on the backend. */
export interface ExamPartItem {
  partCode: string
  score: ScoreItem
}

/**
 * Whether the candidate passed this exam phase, derived only from an official "quienes han
 * superado" listing — never from an invented passing threshold. UNKNOWN means no such listing
 * has been published yet, not that the outcome is unclear.
 */
export type PassStatus = 'PASSED' | 'NOT_PASSED' | 'UNKNOWN'

/** Matches ExamResultItem in CandidateResultsResponse. */
export interface ExamResultItem {
  sourceDocument: string
  documentType: string
  examName: string
  body: string
  specialty: string
  tribunalNumber: string
  accessCode: string
  parts: ExamPartItem[]
  totalScore: ScoreItem
  attendanceStatus: string
  valid: boolean
  extractorVersion: string
  processedAt: string
  passStatus: PassStatus
}

/** Matches GET /api/v1/candidates/{id}/results. */
export interface CandidateResultsResponse {
  id: number
  maskedIdentifier: string
  fullName: string
  results: ExamResultItem[]
}

/** Matches ParticipationItem in CandidateParticipationsResponse. */
export interface ParticipationItem {
  convocationYear: number
  convocationCode: string | null
  body: string
  specialty: string
  tribunalNumber: string
  totalMeritScore: number | null
}

/** Matches GET /api/v1/candidates/{id}/participations. */
export interface CandidateParticipationsResponse {
  id: number
  maskedIdentifier: string
  fullName: string
  participations: ParticipationItem[]
}
