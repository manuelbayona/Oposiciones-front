/** A single score, kept as both the raw source text and its normalized numeric form. */
export interface ScoreItem {
  rawValue: string
  value: number | null
}

export interface InterinosSearchParams {
  block?: string
  specialtyCode?: string
  page?: number
  size?: number
}

/**
 * Matches InterinosListingEntryItem in InterinosSearchResponse.
 *
 * highestPassedExamGrade/pointsFromPassedOppositionsSince2000 are only present for
 * block = "bloque_i"; currentExamGrade only for "bloque_ii" — null (not an empty ScoreItem)
 * otherwise. The backend never decides which block "won"; both are shown as published.
 *
 * listPosition is the raw "N LISTA" value the source document itself prints — an internal
 * document reference code (e.g. 26034300), not a human-readable rank; kept for traceability but
 * not meant for display. overallRank is the candidate's actual 1-based position within the whole
 * listing — use this to show "Nº de orden".
 *
 * specialtyRank is the candidate's 1-based position among only the entries matching the current
 * search's filters, in the listing's own official order — null unless a specialtyCode filter is
 * applied, since a rank relative to "every specialty" isn't meaningful.
 */
export interface InterinosListingEntryItem {
  candidateId: number
  maskedIdentifier: string
  fullName: string
  listPosition: number
  overallRank: number | null
  specialtyRank: number | null
  accreditedSpecialtyCodes: string[]
  block: string
  totalScore: ScoreItem
  highestPassedExamGrade: ScoreItem | null
  pointsFromPassedOppositionsSince2000: ScoreItem | null
  currentExamGrade: ScoreItem | null
}

/** Matches GET /api/v1/interinos. */
export interface InterinosSearchResponse {
  items: InterinosListingEntryItem[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

/** Matches TeachingExperienceItem in CandidateInterinosResponse. */
export interface TeachingExperienceItem {
  b1: ScoreItem
  b2: ScoreItem
  b3: ScoreItem
  b4: ScoreItem
  total: ScoreItem
}

/**
 * Matches InterinosEntryItem in CandidateInterinosResponse. listPosition is the raw document
 * reference code (kept for traceability, not for display) — overallRank is the candidate's
 * actual 1-based position within the listing; show this as "Nº de orden".
 */
export interface InterinosEntryItem {
  listPosition: number
  overallRank: number | null
  accreditedSpecialtyCodes: string[]
  block: string
  teachingExperience: TeachingExperienceItem
  totalScore: ScoreItem
  highestPassedExamGrade: ScoreItem | null
  pointsFromPassedOppositionsSince2000: ScoreItem | null
  currentExamGrade: ScoreItem | null
  valid: boolean
  extractorVersion: string
  processedAt: string
}

/** Matches GET /api/v1/candidates/{id}/interinos. */
export interface CandidateInterinosResponse {
  id: number
  maskedIdentifier: string
  fullName: string
  entries: InterinosEntryItem[]
}

/** Matches GET /api/v1/interinos/specialties — specialty code -> human-readable name. */
export type SpecialtyLegend = Record<string, string>
