import { z } from "zod"

// Shared schema for UI preferences stored in User.uiPreferences.
// Used by both the API route (validation on write/read) and the
// authenticated layout (hydration), so they cannot diverge.
// `.catch({})` tolerates corrupted stored JSON (falls back to empty object);
// `.strip()` discards unknown keys (only known booleans are stored).
export const uiPreferencesSchema = z
  .object({
    sidebarCollapsed: z.boolean().optional(),
    filtersVisible: z.boolean().optional(),
  })
  .catch({})

// Output shape with required booleans; consumers apply defaults.
export interface UIPreferences {
  sidebarCollapsed: boolean
  filtersVisible: boolean
}

// Parse stored JSON and apply defaults, returning a fully-typed object.
export function parseUIPreferences(value: unknown): UIPreferences {
  const parsed = uiPreferencesSchema.parse(value ?? {})
  return {
    sidebarCollapsed: parsed.sidebarCollapsed ?? false,
    filtersVisible: parsed.filtersVisible ?? true,
  }
}

export const UI_PREFERENCES_DEFAULTS: UIPreferences = {
  sidebarCollapsed: false,
  filtersVisible: true,
}
