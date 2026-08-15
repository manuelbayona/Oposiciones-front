const BLOCK_LABELS: Record<string, string> = {
  bloque_i: 'Bloque I',
  bloque_ii: 'Bloque II',
}

/** Falls back to the raw value verbatim for any block the frontend doesn't know about yet. */
export function formatBlock(block: string): string {
  return BLOCK_LABELS[block] ?? block
}
