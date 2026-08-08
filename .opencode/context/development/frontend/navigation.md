<!-- Context: development/frontend/nav | Priority: high | Version: 1.5 | Updated: 2026-08-08 -->

# Frontend Development

**Purpose**: Client-side patterns for this project (Next.js App Router, shadcn/ui, TailwindCSS)

---

## Structure

```
frontend/
├── navigation.md
├── when-to-delegate.md
└── concepts/
    ├── form-patterns.md         # Segment form (PromptForm 3 sections)
    ├── filter-patterns.md       # URL-driven multi-dimension filters
    ├── search-clear-pattern.md  # Clear button for search inputs
    ├── view-mode-pattern.md     # Card/list toggle with persistence
    ├── ui-preferences-pattern.md # UI prefs en cuenta (UIContext, User.uiPreferences)
    └── theme-accent-pattern.md  # Dark mode + accent color (CSS vars, anti-FOUC)
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Segmented form pattern** | `concepts/form-patterns.md` |
| **URL-driven filters** | `concepts/filter-patterns.md` |
| **Search clear button** | `concepts/search-clear-pattern.md` |
| **View mode toggle** | `concepts/view-mode-pattern.md` |
| **UI preferences (en cuenta)** | `concepts/ui-preferences-pattern.md` |
| **Theme + accent color** | `concepts/theme-accent-pattern.md` |
| **When to delegate** | `when-to-delegate.md` |

---

## Related Context

- **UI Navigation** → `../../ui/navigation.md`
- **React patterns** → `../../ui/web/concepts/react-patterns.md`
- **Backend API patterns** → `../backend/concepts/nextjs-api-patterns.md`
- **N:M AND filter guide** → `../backend/guides/prisma-nm-and-filters.md`
- **Searchable fields reference** → `../backend/lookup/searchable-fields-dimensions.md`
- **Core Standards** → `../../core/standards/code-quality.md`

---

## Nota de versión

### Versión 1.5 — 2026-08-08
- Eliminada la rama `react/` del árbol y la ruta `react/react-patterns.md` de las rutas rápidas: no existe en el disco.
- Corregida la referencia de patrones de React a su ubicación real: `../../ui/web/concepts/react-patterns.md`.

### Versión 1.4 — 2026-08-06
- Versión anterior con la rama `react/` y la ruta `react/react-patterns.md` (inexistentes). Queda como histórico.
