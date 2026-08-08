<!-- Context: project-intelligence/business | Priority: high | Version: 1.4 | Updated: 2026-08-06 (v1.4: estado al 2026-08-06 — plan completo, 388 pruebas en 40 suites, compartidos existentes, límite por IP activo sin Upstash) -->

# Business Domain

> Document the business context, problems solved, and value created.

## Quick Reference

- **Purpose**: Understand why this project exists
- **Update When**: Business direction changes, new features shipped, pivot
- **Audience**: Developers needing context, stakeholders, product team

## Project Identity

```
Project Name: Prompt Database
Tagline: Manage and organize your AI prompts
Problem Statement: AI practitioners work with multiple AI platforms (ChatGPT, Claude, Midjourney, etc.) and accumulate hundreds of prompts. They need a centralized system to create, organize, search, and reuse prompts across different platforms and use cases.
Solution: A full-stack web application (Next.js 14 + Prisma + PostgreSQL) with CRUD operations, hierarchical categories, multi-tag taxonomy, N:M relations for platforms/use cases/client projects/model hints, full-text search, export/import with versioning, usage tracking, and multi-language support.
```

## Target Users

| User Segment | Who They Are | What They Need | Pain Points |
|--------------|--------------|----------------|-------------|
| AI Practitioners | Prompt engineers, developers, content creators using multiple AI tools (ChatGPT, Cursor, Midjourney, Suno) | A single place to store, organize, and find prompts across platforms | Prompts scattered across chat histories, no way to reuse, difficult to organize and classify |
| Teams | Small teams sharing prompt libraries | Shared prompt collection with consistent taxonomy and metadata | No centralized prompt management, duplicate efforts, inconsistent classification |

## Value Proposition

**For Users**:
- Centralize all prompts from multiple AI platforms in one place
- Find any prompt instantly with full-text search + multi-dimensional filters (category, tags, platform, status, language)
- Organize with hierarchical categories, tags, platforms, use cases, client projects, and model hints
- Export/import prompts between instances with versioned JSON format (v2.0 with N:M support)
- Track usage count and last used date for each prompt

## Success Metrics

Not yet defined — project is in development phase. Current focus is feature completion (4 of 5 phases done) rather than quantitative targets.

> **2026-08-06**: todas las fases del plan de trabajo (A–D) y la etapa final están completadas y desplegadas; las métricas cuantitativas siguen sin definir.

## Key Stakeholders

See project maintainers (not documented in project files).

## Roadmap Context

**Current Focus**: 4 of 5 development phases completed. Fase 5 (Validation & Polish) done — build verified, tests passing (81/81, 12 suites, 100%), deployed to Vercel with manual smoke tests completed. i18n: en-GB base + es-ES complete, deployed to PROD (2026-08-06).

**Estado al 2026-08-06**: todas las fases del plan de trabajo (A–D) y la etapa final completadas y desplegadas. Pruebas actuales: 388 en 40 suites, cobertura del 79.63% de las líneas. Los prompts compartidos ya existen (campo compartido, página de compartidos y API). El límite de intentos está activo por cuenta e IP, sin Upstash (resuelto sin Redis externo).

**Next Milestone**: Keep context updated as new features ship (category hierarchy 2-level limit, auto-add parent, crash fixes verified 2026-08-04; i18n es-ES deployed 2026-08-06).

**Long-term Vision**: Mature prompt management platform with full multi-language support (i18n: 8 locales pending translation + language selector), AI-assisted prompt generation, team collaboration and sharing features, and expanded admin panel.

> **2026-08-06**: los prompts compartidos ya están implementados (campo compartido, página de compartidos y API); siguen pendientes la colaboración en equipo, el selector de idioma y los 8 locales por traducir.

## Business Constraints

- **Hosted on Vercel (Hobby/free tier)** — limits bandwidth (100 GB/mo), execution time (100 GB-hr/mo), and DB storage (512 MB on Neon)
- **PostgreSQL on Neon (free tier)** — 512 MB storage, 60 concurrent connections, auto-pause during inactivity
- **Credentials-only authentication** — no OAuth providers configured (Google, GitHub, etc.); uses NextAuth.js with CredentialsProvider + JWT strategy
- **Single-user by design** — multi-user capable (User model with roles: USER, ADMIN) but no team/collaboration features yet
- **Rate limiting not active** — feature flag `UPSTASH_ENABLED="false"`; Upstash Redis integration optional, pending activation
  - **2026-08-06 (resuelto)**: el límite de intentos está activo por cuenta e IP, sin Upstash — resuelto sin Redis externo; el flag se mantiene y la opción Upstash ya no es necesaria.

## Onboarding Checklist

- [ ] Read the project overview (`doc/02_proyecto-overview.md`) and technical briefing (`doc-plan/doc-base/01-Briefing.md`)
- [ ] Review the phases plan (`doc-plan/doc-base/04-Phases-Subphases-Plan.md`) for architectural decisions and dependencies
- [ ] Study the Prisma schema (`prisma/schema.prisma`) — 17 models including auth, core entities, and N:M junction tables
- [ ] Run `npm run dev` and sign in at `http://localhost:3000/auth/signin`
- [ ] Understand the three-segment form layout: Basic Information → Metadata → Advanced
- [ ] Review API routes under `app/api/` — prompts, categories, tags, export, import
- [ ] Read governance rules (`conoc_previo/.governance/reglas_proyecto.md`) before making changes
- [ ] Run `npm test` to verify baseline: 81+ tests across 12+ suites
  - **2026-08-06**: cifras reales verificadas — 388 pruebas en 40 suites, cobertura del 79.63% de las líneas.

## Related Files

- `technical-domain.md` - How this business need is solved technically
- `business-tech-bridge.md` - Mapping between business and technical
- `../lookup/decisions-log.md` - Business decisions with context

## Evolución

- **v1.4 (2026-08-06)**: estado de negocio actualizado — plan de trabajo completo (todas las fases A–D y la etapa final, desplegadas), cifras reales de pruebas (388 en 40 suites, cobertura del 79.63% de las líneas), prompts compartidos existentes (campo compartido, página de compartidos y API) y límite de intentos por IP activo sin Upstash (resuelto sin Redis externo). Las afirmaciones anteriores (4 de 5 fases, 81 pruebas, límite de intentos inactivo) se conservan como histórico con notas de fecha.
- **v1.3 (2026-08-06)**: versión anterior, conservada en las secciones precedentes.
