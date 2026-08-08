<!-- Context: development/navigation | Priority: critical | Version: 2.1 | Updated: 2026-08-08 -->

# Development Navigation

**Purpose**: Software development across all stacks

---

## Structure

```
development/
├── navigation.md
├── ui-navigation.md           # Navegación rápida de interfaz
├── backend-navigation.md      # Navegación rápida de backend
├── fullstack-navigation.md    # Navegación de desarrollo completo
│
├── principles/                # Principios universales (independientes del lenguaje)
│   ├── navigation.md
│   └── concepts/
│       ├── clean-code.md
│       └── api-design.md
│
├── frameworks/                # Marcos de trabajo completos
│   └── navigation.md
│
├── ai/                        # Inteligencia artificial y agentes
│   ├── navigation.md
│   └── mastra-ai/
│       ├── concepts/          # Conceptos del marco
│       ├── errors/            # Errores frecuentes
│       ├── examples/          # Ejemplos funcionales
│       ├── guides/            # Guías paso a paso
│       └── lookup/            # Referencia rápida
│
├── frontend/                  # Lado del cliente
│   ├── navigation.md
│   ├── concepts/              # Patrones de formularios, filtros, tema, preferencias
│   └── guides/                # Cuándo delegar en la especialista de interfaz
│
├── backend/                   # Lado del servidor
│   ├── navigation.md
│   ├── concepts/              # Patrones de API, autenticación, aislamiento
│   ├── examples/              # Ejemplos de extremos
│   ├── guides/                # Guías de Prisma
│   ├── lookup/                # Rutas de API y campos de búsqueda
│   └── errors/                # Errores comunes de API
│
├── data/                      # Capa de datos
│   ├── navigation.md
│   ├── concepts/              # Patrones de Prisma y tablas de catálogo
│   ├── lookup/                # Prisma de referencia rápida
│   └── errors/                # Errores comunes de Prisma
│
├── integration/               # Intercambio de datos
│   ├── navigation.md
│   └── concepts/              # Exportación e importación
│
└── infrastructure/            # Operaciones y despliegue
    ├── navigation.md
    ├── concepts/              # Despliegue en Vercel
    └── guides/                # Desarrollo local con Docker
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Interfaz** | `ui-navigation.md` |
| **Cuándo delegar la interfaz** | `frontend/guides/when-to-delegate.md` |
| **Backend y API** | `backend-navigation.md` |
| **Desarrollo completo** | `fullstack-navigation.md` |
| **Código limpio** | `principles/concepts/clean-code.md` |
| **Diseño de API** | `principles/concepts/api-design.md` |
| **Backend en detalle** | `backend/navigation.md` |
| **Capa de datos** | `data/navigation.md` |
| **Integración** | `integration/navigation.md` |
| **Infraestructura** | `infrastructure/navigation.md` |
| **Inteligencia artificial** | `ai/navigation.md` |

---

## By Concern

**Principles** → Prácticas universales de desarrollo (código limpio, diseño de API)
**AI** → Inteligencia artificial y agentes (MAStra AI)
**Frontend** → Patrones de interfaz y componentes
**Backend** → API de Next.js, autenticación, aislamiento por fila
**Data** → Prisma y PostgreSQL
**Integration** → Exportación, importación y consumo de API externas
**Infrastructure** → Despliegue en Vercel y desarrollo local con Docker

---

## Related Context

- **Core Standards** → `../core/standards/navigation.md`
- **UI Patterns** → `../ui/navigation.md`

---

## Nota de versión

### Versión 2.1 — 2026-08-08
- Organización por función: `principles/` ahora usa `concepts/` (api-design.md, clean-code.md) y `frontend/` usa `guides/` (when-to-delegate.md).
- Actualizadas las rutas rápidas y el árbol de estructura.

### Versión 2.0 — 2026-08-08
- Reconstruido el árbol con la estructura real del disco. Eliminadas las ramas inexistentes: `frameworks/tanstack-start/`, `frontend/react/`, `backend/` con `api-patterns/`, `nodejs/`, `python/` y `authentication/`, `data/` con `sql-patterns/`, `nosql-patterns/` y `orm-patterns/`, `integration/` con `package-management/`, `api-integration/` y `third-party-services/`, e `infrastructure/` con `docker/` y `ci-cd/`.
- La estructura real por área es `concepts/`, `examples/`, `errors/`, `guides/` y `lookup/` (backend, data, frontend) o `concepts/` y `guides/` (infrastructure, integration).
- Añadidas las sub-navegaciones existentes: `principles/`, `frameworks/`, `ai/` (con `mastra-ai/`), `frontend/` (con `when-to-delegate.md`), `backend/`, `data/`, `integration/` e `infrastructure/`.
- Incluidos los archivos raíz: `backend-navigation.md`, `ui-navigation.md` y `fullstack-navigation.md`.
- Actualizadas las rutas rápidas y la sección «By Concern» con los archivos verificados en el disco.

### Versión 1.0 — 2026-02-15
- Versión original con ramas planificadas que no existían en el disco: `frameworks/tanstack-start/`, `frontend/react/`, `backend/` con `api-patterns/`, `nodejs/`, `python/` y `authentication/` (futuro), `data/` con `sql-patterns/`, `nosql-patterns/` y `orm-patterns/` (futuro), `integration/` con `package-management/`, `api-integration/` y `third-party-services/` (futuro), e `infrastructure/` con `docker/` y `ci-cd/` (futuro). Queda como histórico.
