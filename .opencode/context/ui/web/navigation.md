<!-- Context: ui/navigation | Priority: critical | Version: 2.1 | Updated: 2026-08-08 -->

# Web UI Context

**Purpose**: Web-based UI patterns, animations, styling standards, and React component design

**Last Updated**: 2026-08-08

---

## Structure

```
ui/web/
├── navigation.md
├── concepts/         # What it is
├── examples/         # Working code
└── design/           # Advanced design patterns
```

---

## Quick Navigation

### Concepts
| File | Description | Priority |
|------|-------------|----------|
| `concepts/animation-basics.md` | Animation fundamentals, timing, easing | high |
| `concepts/animation-advanced.md` | Recipes, best practices, accessibility | medium |
| `concepts/design-systems.md` | Design system principles and component libraries | medium |
| `concepts/react-patterns.md` | Modern React patterns, hooks, component design | high |
| `concepts/ui-styling.md` | CSS frameworks, Tailwind patterns, styling best practices | high |

### Examples
| File | Description | Priority |
|------|-------------|----------|
| `examples/animation-components.md` | Button, card, modal, dropdown animations | high |
| `examples/animation-chat.md` | Chat UI and message animations | medium |
| `examples/animation-forms.md` | Form input and validation animations | medium |
| `examples/animation-loading.md` | Skeleton, spinner, progress animations | medium |

### Subcategories
| Subcategory | Description | Path |
|-------------|-------------|------|
| **design/** | Advanced design patterns (scrollytelling, effects) | `design/navigation.md` |

---

## Loading Strategy

### For general web UI work:
1. Load `concepts/ui-styling.md` (CSS frameworks, Tailwind)
2. Load `concepts/react-patterns.md` (component patterns)
3. Reference `concepts/animation-basics.md` (if animations needed)

### For animation work:
1. Load `concepts/animation-basics.md` (fundamentals, timing, easing)
2. Load `examples/animation-components.md` (UI component animations)
3. Reference `examples/animation-chat.md` for chat UI patterns
4. Reference `concepts/animation-advanced.md` for recipes and accessibility

### For scroll animations:
1. Navigate to `design/` subcategory
2. Load scroll-linked animation guides

---

## Related Categories

- `ui/terminal/` - Terminal UI patterns
- `development/frontend/` - Frontend development patterns
- `development/` - General development patterns

---

## Nota de versión

### Versión 2.1 — 2026-08-08
- Eliminada la sección "Guides": la carpeta `ui/web/guides/` no existe en el disco (referencias fantasma a `guides/images-guide.md`, `guides/icons-guide.md` y `guides/fonts-guide.md`).
- Eliminada la sección "Lookup": la carpeta `ui/web/lookup/` no existe en el disco (referencia fantasma a `lookup/cdn-resources.md`).
- Corregido el árbol de estructura: `ui/web/` contiene únicamente `concepts/`, `examples/` y `design/`.
- Actualizada la fecha de última modificación.

### Versión 2.0 — 2026-07-14
- Versión anterior con referencias a `guides/` (3 archivos) y `lookup/` (1 archivo) que no existen en el disco.
