<!-- Context: development/backend-navigation | Priority: high | Version: 2.0 | Updated: 2026-08-08 -->

# Backend Development Navigation

**Scope**: Server-side, APIs, databases, auth

---

## Structure

```
backend/
├── navigation.md
├── concepts/
│   ├── nextjs-api-patterns.md         # Patrón de API en Next.js (Auth→Zod→Prisma→Response)
│   ├── nextauth-setup.md              # Configuración de NextAuth + JWT
│   ├── auth-hardening-pattern.md      # Límite de peticiones en BD + revocación de tokenVersion
│   └── row-level-isolation-pattern.md # where.userId en toda consulta (aislamiento)
├── examples/
│   └── temp-admin-bulk-op.md          # Extremo de administración temporal para operaciones masivas
├── guides/
│   └── prisma-nm-and-filters.md       # Patrón de filtro N:M con AND en Prisma
├── lookup/
│   ├── api-routes.md                  # Referencia rápida de rutas de API
│   └── searchable-fields-dimensions.md # Campos de búsqueda y dimensiones de filtro
└── errors/
    └── api-common-errors.md           # Problemas comunes de API y soluciones
```

---

## Quick Routes

| Task | Path |
|------|------|
| **Patrón de código de API** | `backend/concepts/nextjs-api-patterns.md` |
| **Configuración de autenticación** | `backend/concepts/nextauth-setup.md` |
| **Refuerzo de autenticación** | `backend/concepts/auth-hardening-pattern.md` |
| **Aislamiento por fila** | `backend/concepts/row-level-isolation-pattern.md` |
| **Extremo de administración temporal** | `backend/examples/temp-admin-bulk-op.md` |
| **Filtro N:M con AND** | `backend/guides/prisma-nm-and-filters.md` |
| **Rutas de API en tabla** | `backend/lookup/api-routes.md` |
| **Campos de búsqueda y dimensiones** | `backend/lookup/searchable-fields-dimensions.md` |
| **Errores comunes** | `backend/errors/api-common-errors.md` |

---

## By Concern

**API** → `backend/concepts/nextjs-api-patterns.md`
**Autenticación** → `backend/concepts/nextauth-setup.md`, `backend/concepts/auth-hardening-pattern.md`
**Aislamiento de datos** → `backend/concepts/row-level-isolation-pattern.md`
**Base de datos** → `data/navigation.md`
**Guías y referencias** → `backend/guides/`, `backend/lookup/`
**Errores** → `backend/errors/api-common-errors.md`

---

## Related Context

- **API Design Principles** → `principles/api-design.md`
- **Data Patterns** → `data/navigation.md`
- **Core Standards** → `../core/standards/code-quality.md`

---

## Nota de versión

### Versión 2.0 — 2026-08-08
- Reconciliado con la estructura real del disco: la navegación apunta ahora a los archivos existentes de `backend/` (concepts/, examples/, guides/, lookup/, errors/).
- Eliminadas las entradas «[futuro]» y las ramas inexistentes (`api-patterns/`, `nodejs/`, `python/`, `authentication/`, `middleware/`).
- Actualizadas las rutas rápidas y la sección «By Concern» con los archivos verificados.

### Versión 1.0 — 2026-02-15
- Versión original con ramas planificadas inexistentes: `api-patterns/` (rest-design, graphql-design, grpc-patterns, websocket-patterns), `nodejs/` (express-patterns, fastify-patterns, error-handling), `python/` (fastapi-patterns, django-patterns), `authentication/` (jwt-patterns, oauth-patterns, session-management) y `middleware/` (logging, rate-limiting, cors). Queda como histórico.
