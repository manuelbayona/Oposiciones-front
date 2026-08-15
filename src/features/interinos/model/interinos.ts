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
 * specialtyRank is the candidate's 1-based position among only the entries matching the current
 * search's filters, in the listing's own official order (listPosition) — null unless a
 * specialtyCode filter is applied, since a rank relative to "every specialty" isn't meaningful.
 */
export interface InterinosListingEntryItem {
  candidateId: number
  maskedIdentifier: string
  fullName: string
  listPosition: number
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

/** Matches InterinosEntryItem in CandidateInterinosResponse. */
export interface InterinosEntryItem {
  listPosition: number
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
