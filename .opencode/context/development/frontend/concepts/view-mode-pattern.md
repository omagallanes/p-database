<!-- Context: development/frontend/concepts | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: View Mode Preference (Card/List Toggle)

**Core Idea**: Users can switch between card view (visual, rich preview) and list view (dense, compact). Preference persists across sessions via `PATCH /api/user/preferences` and is stored in `User.promptListViewPreference` (default `"cards"`).

**Key Points**:
- **Server-side**: DB field `User.promptListViewPreference` stores `"cards"` or `"list"`
- **Client-side**: `ViewModeContext` (React context) provides `viewMode` and `setViewMode` to all components
- **Hydration**: Server component reads DB preference → passes as `initialViewMode` to provider
- **Toggle UI**: `ViewToggle` component (icon buttons) next to page title
- **Persistence**: Toggle calls `PATCH /api/user/preferences` with `{ promptListViewPreference: "list" }`
- **Default**: `"cards"` for new users (defined in Prisma schema)

**Component architecture**:
```
Server Component (reads DB) → passes initialViewMode
  → ViewModeProvider (context wrapper, sets initial state)
    → PromptList (reads context, renders cards or list layout)
    → ViewToggle (reads context, calls PATCH on change)
```

**Quick example** (context provider):
```typescript
"use client"
export function ViewModeProvider({ initialViewMode, children }) {
  const [viewMode, setViewMode] = useState(initialViewMode)
  const toggle = (mode: string) => {
    setViewMode(mode)
    fetch("/api/user/preferences", {
      method: "PATCH",
      body: JSON.stringify({ promptListViewPreference: mode })
    })
  }
  return <ViewModeContext.Provider value={{ viewMode, toggle }}>{children}</ViewModeContext.Provider>
}
```

**Reference**: `contexts/ViewModeContext.tsx`, `components/prompt/PromptList.tsx`, `app/api/user/preferences/route.ts`
