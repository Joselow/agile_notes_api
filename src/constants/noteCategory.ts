/** Stored lowercase; accepts legacy Title Case from DB */
export const NOTE_CATEGORIES = ['task', 'apunte', 'aprendizaje'] as const
export type NoteCategoryKey = (typeof NOTE_CATEGORIES)[number]

const LEGACY_MAP: Record<string, NoteCategoryKey> = {
  Task: 'task',
  Apunte: 'apunte',
  Aprendizaje: 'aprendizaje',
}

export function normalizeCategory(input: string | undefined | null): NoteCategoryKey {
  const raw = (input ?? 'apunte').trim()
  const lower = raw.toLowerCase()
  if (NOTE_CATEGORIES.includes(lower as NoteCategoryKey)) {
    return lower as NoteCategoryKey
  }
  const mapped = LEGACY_MAP[raw]
  if (mapped) return mapped
  return 'apunte'
}

export function isTaskCategory(category: string | undefined | null): boolean {
  return normalizeCategory(category) === 'task'
}
