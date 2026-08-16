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

/**
 * Matches ExamResultItem in CandidateResultsResponse. `phase` is the normalized classification of
 * `examName` ("primera_prueba"/"segunda_prueba"/"prueba_unica"/"fase_oposicion"), `null` when the
 * text doesn't match any recognised phase — `examName` (the raw publication wording) is kept for
 * traceability, but the UI should prefer `phase` for display since the raw wording varies between
 * a provisional listing, its definitive revision, and a "quienes han superado" listing.
 */
export interface ExamResultItem {
  sourceDocument: string
  documentType: string
  examName: string
  phase: string | null
  body: string
  specialty: string
  tribunalNumber: string
  convocationYear: number
  convocationCode: string | null
  accessCode: string
  parts: ExamPartItem[]
  totalScore: ScoreItem
  attendanceStatus: string
  valid: boolean
  extractorVersion: string
  processedAt: string
  passStatus: PassStatus
  /**
   * Distinguishes a provisional listing from its definitive correction for the same phase.
   * `null` when the source document's header states neither (or predates a schema version that
   * captured this) — two results for the same phase can legitimately report different scores, so
   * the UI must label which one is current rather than showing them as unlabeled duplicates.
   */
  isDefinitive: boolean | null
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
