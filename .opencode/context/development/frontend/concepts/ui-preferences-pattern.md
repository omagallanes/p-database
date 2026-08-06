<!-- Context: development/frontend/concepts | Priority: high | Version: 1.1 | Updated: 2026-08-06 -->

# Concept: UI Preferences Pattern (UIContext)

**Core Idea**: Las preferencias de interfaz (colapso del sidebar, visibilidad de filtros, y futuras: idioma, tema, color, columnas) se persisten en la CUENTA como JSON en `User.uiPreferences` (`@default("{}")`). Un schema Zod compartido (`lib/ui-preferences.ts`) las valida en servidor y cliente; el layout server las lee de BD y las expone a componentes cliente vía `UIContext`. Nunca se usa `localStorage` (decisión del usuario: el entorno queda "homologado" en cualquier dispositivo).

**Key Points**:
- **Schema compartido** `lib/ui-preferences.ts`: `uiPreferencesSchema` con `.catch({})` (tolerante a JSON corrupto en BD) y `.strip()` (descarta claves desconocidas); `parseUIPreferences()` aplica defaults: `sidebarCollapsed: false`, `filtersVisible: true`.
- **Setters optimistas**: `setSidebarCollapsed` / `setFiltersVisible` actualizan estado local al instante y disparan `PATCH /api/user/preferences` con fusión parcial (`{ uiPreferences: { <clave>: valor } }`); errores 401/red silenciosos (solo `console.error`).
- **No persistido**: `activeFilterCount` es estado en memoria (derivado de la URL), nunca se envía al servidor.
- **API**: `PATCH` fusiona parcial (`{...existing, ...partial}`); `GET` devuelve defaults para sesiones no autenticadas.
- **Ampliado en Fase B**: schema con `theme`, `accentColor`, `filterOrder`, `columns` (sin migración de BD — el JSON no tiene esquema fijo en Postgres).

**Extensión Fase B — layout configurable (filterOrder + columns)**:
- **`filterOrder: string[]`**: claves de las tarjetas de filtro (`["category", "tags", "platform", "status", "language", "clientProject", "useCase"]`); `PromptFilters` renderiza mapeando clave → tarjeta. Reordenado en el perfil con flechas arriba/abajo (sin drag & drop, sin dependencias nuevas).
- **`columns: { visible: string[], order: string[] }`**: claves posibles `status, platforms, categories, tags, clientProject, useCase, language, type`. **Fijas siempre**: ★, Copiar, Editar, Título (en ese orden). Mínimo 1 visible. Se aplican en `PromptList` (tabla) y en las tarjetas (campos insertados en estructura existente). `useCase` muestra la relación N:M si existe, respaldo al campo legacy.
- Configuración en pestaña "Escritorio" del perfil (checkboxes + flechas), persistida con `PATCH uiPreferences`.

**Arquitectura**:
```
app/(app)/layout.tsx (server: lee BD → parseUIPreferences)
  → UIContextProvider (initialSidebarCollapsed, initialFiltersVisible)
    → Sidebar · Topbar · PromptsPageContent (componentes cliente)
```

**Quick example** (`lib/ui-preferences.ts`):
```ts
export const uiPreferencesSchema = z
  .object({
    sidebarCollapsed: z.boolean().optional(),
    filtersVisible: z.boolean().optional(),
    theme: z.enum(["light", "dark"]).optional(),
    accentColor: z.string().optional(),           // hex
    filterOrder: z.array(z.string()).optional(),
    columns: z.object({ visible: z.array(z.string()), order: z.array(z.string()) }).optional(),
  })
  .catch({})            // JSON corrupto → {} (strip descarta claves desconocidas)

export function parseUIPreferences(value: unknown): UIPreferences {
  const p = uiPreferencesSchema.parse(value ?? {})
  return { sidebarCollapsed: p.sidebarCollapsed ?? false, filtersVisible: p.filtersVisible ?? true,
           theme: p.theme ?? "light", accentColor: p.accentColor ?? "#7c3aed", ... }
}
```

**Reference**: `contexts/UIContext.tsx` · `lib/ui-preferences.ts` · `app/api/user/preferences/route.ts`

**Related**: `concepts/theme-accent-pattern.md` (tema + color acento) · `concepts/view-mode-pattern.md` — caso escalar legacy (`promptListViewPreference`) previo al JSON `uiPreferences`; `project-intelligence/decisions-log.md` #11, #12 — decisiones "en cuenta, nunca localStorage".
