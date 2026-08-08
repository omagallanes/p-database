<!-- Context: development/fullstack-navigation | Priority: medium | Version: 2.0 | Updated: 2026-08-08 -->

# Full-Stack Development Navigation

**Scope**: End-to-end application development

---

## Current Stack

### Proyecto (Next.js + Prisma + PostgreSQL)
```
Frontend: frontend/ (concepts/, when-to-delegate.md) + ui/web/ (concepts/, examples/)
Backend:  backend/ (concepts/, examples/, guides/, lookup/, errors/)
Data:     data/ (concepts/, lookup/, errors/)
API:      backend/concepts/nextjs-api-patterns.md
Auth:     backend/concepts/nextauth-setup.md, backend/concepts/auth-hardening-pattern.md
```

---

## Quick Routes

| Layer | Navigate To |
|-------|-------------|
| **Frontend** | `ui-navigation.md` |
| **Backend** | `backend-navigation.md` |
| **Data** | `data/navigation.md` |
| **Integration** | `integration/navigation.md` |
| **Infrastructure** | `infrastructure/navigation.md` |
| **AI** | `ai/navigation.md` |
| **Frameworks** | `frameworks/navigation.md` |
| **Principles** | `principles/navigation.md` |

---

## Common Workflows

**New API endpoint**:
1. `principles/api-design.md` (principios)
2. `backend/concepts/nextjs-api-patterns.md` (patrón Auth→Zod→Prisma→Response)
3. `backend/errors/api-common-errors.md` (errores conocidos)

**New React feature**:
1. `frontend/concepts/form-patterns.md` (formularios de segmentos)
2. `frontend/concepts/filter-patterns.md` (filtros por URL)
3. `../ui/web/concepts/ui-styling.md` (estilo de interfaz)
4. `../ui/web/concepts/react-patterns.md` (patrones de React)

**Database integration**:
1. `data/concepts/prisma-patterns.md` (consultas y transacciones)
2. `data/lookup/prisma-cheatsheet.md` (referencia rápida)
3. `backend/guides/prisma-nm-and-filters.md` (filtros N:M con AND)

**Deployment**:
1. `infrastructure/concepts/vercel-deployment.md` (despliegue en Vercel)
2. `infrastructure/guides/docker-local-dev.md` (desarrollo local con Docker)

**Data exchange**:
1. `integration/concepts/export-import-patterns.md` (exportación e importación)

---

## Related Context

- **Clean Code** → `principles/clean-code.md`
- **API Design** → `principles/api-design.md`
- **Core Standards** → `../core/standards/navigation.md`

---

## Nota de versión

### Versión 2.0 — 2026-08-08
- Reconstruida con el stack real del proyecto (Next.js App Router + Prisma + PostgreSQL + NextAuth), verificado en `backend/`, `data/` y `frontend/`.
- Eliminadas las ramas inexistentes y las entradas «[futuro]»: MERN (express-patterns, nosql-patterns/mongodb), T3 con tRPC (trpc-patterns, orm-patterns/prisma), Python full-stack (fastapi-patterns, django-patterns), sql-patterns, package-management, api-integration y third-party-services.
- Actualizados los flujos de trabajo comunes con los archivos reales del disco.

### Versión 1.0 — 2026-02-15
- Versión original con pilas genéricas planificadas (MERN, T3, Python full-stack) y rutas a carpetas inexistentes. Queda como histórico.
