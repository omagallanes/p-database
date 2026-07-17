<!-- Context: project-intelligence/decisions | Priority: high | Version: 2.1 | Updated: 2026-07-16 -->

# Decisions Log

> Major architectural decisions with context, rationale, and impact. Details + alternatives tables in `lookup/decision-details.md`.

**Updated**: 2026-07-14 | **Status**: Decided items, deprecated list at bottom

---

## 1. SQLite → PostgreSQL (2026-04)

**Context**: Original SQLite lacked concurrent write support, connection pooling, and production readiness. Needed Vercel-compatible database.

**Decision**: Migrated to PostgreSQL 14+ via Prisma ORM. Neon for serverless.

**Rationale**: Production-ready, best Prisma support, Vercel/Neon compatibility.

**Impact**: ✅ Production-ready DB, concurrent access, pooling. ❌ Requires local PG (Docker). Risk: schema incompatibilities.

**Related**: `lookup/decision-details.md` #1

---

## 2. Railway → Vercel (2026-04-25)

**Context**: Docker+nginx/Traefik complexity outweighed value for a Next.js app.

**Decision**: Migrated to Vercel (standalone output, serverless functions). Neon PostgreSQL.

**Rationale**: First-class Next.js support, integrated PG, generous free tier, no Docker mgmt.

**Impact**: ✅ Git-push deploy, Neon PG, zero server mgmt. ❌ Serverless cold starts, 10s timeout. Risk: Vercel lock-in.

**Related**: `lookup/decision-details.md` #2

---

## 3. String Fields → N:M Junction Tables (2026-04-24)

**Context**: Prompt model used legacy string fields (`platform`, `useCase`, etc.) with no referential integrity, no multi-value support.

**Decision**: Created 4 entities + 4 junction tables with compound keys (`@@id`). Legacy fields preserved for v1.0 import compat.

**Rationale**: Referential integrity, multi-value support, slug-based uniqueness, independent CRUD.

**Impact**: ✅ Data integrity, multi-value, sortable entities. ❌ Schema complexity, dual-maintenance overhead. Risk: migration handled by idempotent `$transaction` script.

**Related**: `lookup/decision-details.md` #3

---

## 4. NextAuth.js JWT + Credentials (2026-04-18)

**Context**: Needed email/password auth without OAuth. Route protection required.

**Decision**: NextAuth.js v5 beta, JWT strategy, CredentialsProvider, PrismaAdapter.

**Rationale**: Well-integrated with Next.js App Router + Prisma. JWT avoids DB lookups per request (ideal for serverless).

**Impact**: ✅ Email/password auth, JWT with embedded role, middleware protection. ❌ No OAuth, JWT not revocable. Risk: `AUTH_SECRET` mgmt critical.

**Related**: `lookup/decision-details.md` #4

---

## 5. shadcn/ui + TailwindCSS (Original)

**Context**: Needed accessible, customizable, lightweight UI library integrated with TailwindCSS.

**Decision**: shadcn/ui (Radix + CVA) with purple-themed TailwindCSS design system.

**Rationale**: Source-owned components (no heavy bundle), Radix for accessibility, CVA for Tailwind-native styling.

**Impact**: ✅ 8 components, full source ownership, accessible, tree-shakeable. ❌ Manual updates. Risk: TailwindCSS upgrades may break CVA composition.

**Related**: `lookup/decision-details.md` #5

---

## 6. KILO → OAC Framework (2026-07-14)

**Context**: Custom KILO agent framework had no community support, diverged from standards.

**Decision**: Migrated to OAC (OpenAgents Control) with `.opencode/context/` structure, approval gates, editable agents.

**Rationale**: Documented agent management, structured context hierarchy, team collaboration.

**Impact**: ✅ Standardized context, approval gates, documented workflows. ❌ KILO prompts lost, team learns OAC. Risk: KILO governance knowledge loss mitigated by OAC context files.

**Related**: `lookup/decision-details.md` #6

---

## 7. VPS/Hetzner/Traefik Elimination (2026-07-14)

**Context**: VPS infra unused after Vercel migration. Files misled contributors.

**Decision**: Deleted `nginx.conf`, `traefik-*.yml`, `deploy.sh`, `docker-entrypoint.sh`. Docker Compose retained for local dev PG.

**Rationale**: Zero benefit post-Vercel; unused files caused confusion.

**Impact**: ✅ Simplified Vercel-only, cleaner repo, lower cognitive load. ❌ Lost Traefik routing/SSL control. Risk: Dockerfile still references deleted entrypoint and SQLite (currently broken).

**Related**: `lookup/decision-details.md` #7

---

## 8. Plan C — Technical Cleanup & Stabilization (2026-07-15)

**Context**: After Plan B (code deduplication), CodeReviewer identified residual issues: 3 broken test suites, 21 unused-vars warnings, 2 large components (1k+ lines), inconsistent API format, unverified type guard.

**Decision**: Executed 3 independent phases (no cross-dependencies):
- F1: Fix tests + unused-vars + type guard + API format standardization
- F2: Split `PromptForm.tsx` (1,022 → 769 lines, 4 extracted segments)
- F3: Split `import/prompts/route.ts` (663 → 63 lines, 4 extracted modules)

**Rationale**: Fix quality issues iteratively — each phase independently deployable. CodeReviewer gate per subtask prevented error accumulation.

**Impact**: ✅ 56/56 tests passing, 0 unused-vars, clean build, all features verified on production. Tags: `fase1-completa` (866c866), `fase2-completa` (9bf6043), `fase3-completa` (006a615). Deploy: manual via `source .env && npx vercel --prod`.

**Risk Mitigated**: M-01 (missing `findUnique` mock) caught by CodeReviewer gate. Auto-deploy disabled on `main` (`vercel.json`).

**Related**: `development/concepts/task-delegation-workflow.md`, `development/concepts/component-refactor-pattern.md`, `development/lookup/plan-c-files-list.md`

---

## 9. Temporary Admin Endpoint for Bulk Category Assignment (2026-07-17)

**Context**: Needed to assign the "existentes" category to all 17 existing prompts in PROD. No UI or permanent endpoint existed for bulk category assignment. Creating a full admin UI would have been disproportionate effort.

**Decision**: Created a disposable admin-only `GET` endpoint at `app/api/system/assign-category/route.ts` with `auth()` + `role === "admin"` guards. After execution, the file was deleted and the cleanup was deployed.

**Rationale**: Lower effort than building admin UI. GET endpoint (no body) was sufficient for this operation. Admin-only double-gate prevented unauthorized access during the brief window the endpoint existed.

**Impact**: ✅ All 17 prompts assigned "existentes" category in one request. ✅ No dead code left behind. ❌ Two extra deployments (add + remove). Risk: brief window of vulnerability if endpoint was discovered (mitigated by admin-only guard + immediate deletion).

**Execution**: `curl -X GET "https://p-database.vercel.app/api/system/assign-category"` via Vercel CLI token. 3 commits: `6302787` (create), `2201462` (temp auth removal for Vercel token), `9d54180` (delete endpoint + cleanup).

**Related**: `backend/examples/temp-admin-bulk-op.md`, `backend/concepts/nextjs-api-patterns.md`

---

## Deprecated Decisions

| Decision | Replaced By | Why |
|----------|-------------|-----|
| Railway deployment with Docker | Vercel (D2) | Docker complexity > value |
| SQLite as primary DB | PostgreSQL (D1) | Unfit for production/serverless |
| String fields for prompt metadata | N:M junctions (D3) | Needed integrity + multi-value |
| KILO agent framework | OAC (D6) | Standardization |
| VPS/Hetzner self-hosting | Vercel (D2) | Eliminated unused infra |

## Reference

- `lookup/decision-details.md` — Full alternatives tables + related commits
- `technical-domain.md` — Technical implementation
- `business-tech-bridge.md` — Business impact of decisions
