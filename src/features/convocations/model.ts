/**
 * A convocation year, as exposed by GET /api/v1/participations/convocation-years.
 * `convocationYear` remains a provisional proxy on the backend (the import year, not a real
 * convocation identifier) — see Oposiciones-backend's ADR-004/ADR-005.
 */
export type ConvocationYear = number
