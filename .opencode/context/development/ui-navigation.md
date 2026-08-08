<!-- Context: development/ui-navigation | Priority: high | Version: 2.0 | Updated: 2026-08-08 -->

# UI Development Navigation

**Scope**: Frontend code + visual design

---

## Structure

```
Frontend Code (development/frontend/):
├── navigation.md
├── concepts/
│   ├── form-patterns.md          # Formulario de segmentos (PromptForm, 3 secciones)
│   ├── filter-patterns.md        # Filtros multidimensionales dirigidos por URL
│   ├── search-clear-pattern.md   # Botón de limpiar en campos de búsqueda
│   ├── view-mode-pattern.md      # Alternancia tarjeta/lista con persistencia
│   ├── ui-preferences-pattern.md # Preferencias de interfaz en la cuenta
│   └── theme-accent-pattern.md   # Modo oscuro + color de acento (variables CSS)
└── guides/
    └── when-to-delegate.md       # Cuándo delegar en la especialista de interfaz

Visual Design (ui/web/):
├── navigation.md
├── concepts/
│   ├── react-patterns.md         # Patrones de React
│   ├── animation-basics.md       # Fundamentos de animación
│   ├── animation-advanced.md     # Técnicas avanzadas de animación
│   ├── ui-styling.md             # Estándares de estilo de interfaz
│   └── design-systems.md         # Sistemas de diseño
├── examples/                     # Ejemplos de animación (chat, componentes, formularios, carga)
└── design/
    ├── navigation.md
    ├── concepts/                 # Animaciones ligadas al desplazamiento
    ├── examples/                 # Ejemplo de scrollytelling con auriculares
    ├── guides/                   # Construcción de páginas de scrollytelling
    └── lookup/                   # Peticiones de animaciones de desplazamiento
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Patrones de React** | `../ui/web/concepts/react-patterns.md` |
| **Animaciones (fundamentos)** | `../ui/web/concepts/animation-basics.md` |
| **Animaciones (avanzado)** | `../ui/web/concepts/animation-advanced.md` |
| **Estilo de interfaz** | `../ui/web/concepts/ui-styling.md` |
| **Sistemas de diseño** | `../ui/web/concepts/design-systems.md` |
| **Patrones de formulario** | `frontend/concepts/form-patterns.md` |
| **Patrones de filtro** | `frontend/concepts/filter-patterns.md` |
| **Cuándo delegar** | `frontend/guides/when-to-delegate.md` |

---

## By Framework

**React** → `../ui/web/concepts/react-patterns.md`

## By Concern

**Code patterns** → `frontend/` (concepts/, guides/)
**Visual design** → `../ui/web/` (concepts/, examples/, design/)

---

## Related Context

- **Core Standards** → `../core/standards/code-quality.md`
- **UI Category** → `../ui/navigation.md`
- **Frontend Navigation** → `frontend/navigation.md`

---

## Nota de versión

### Versión 2.0 — 2026-08-08
- Reconciliado con la estructura real del disco: eliminada la rama `frontend/react/` (no existe; los patrones de React están en `ui/web/concepts/react-patterns.md`).
- Corregidas las rutas rotas: `ui/web/react-patterns.md` → `../ui/web/concepts/react-patterns.md`, `ui/web/animation-patterns.md` → `../ui/web/concepts/animation-basics.md` y `../ui/web/concepts/animation-advanced.md`, `ui/web/ui-styling-standards.md` → `../ui/web/concepts/ui-styling.md`, `ui/web/design-systems.md` → `../ui/web/concepts/design-systems.md`.
- Eliminadas las entradas «[futuro]» y las ramas inexistentes; añadido el árbol real de `frontend/` y `ui/web/` (incluida `design/` con concepts/, examples/, guides/, lookup/).

### Versión 1.0 — 2026-02-15
- Versión original con la rama `frontend/react/` y rutas rotas a `ui/web/` sin la carpeta `concepts/`. Queda como histórico.
