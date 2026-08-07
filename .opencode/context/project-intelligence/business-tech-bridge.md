<!-- Context: project-intelligence/bridge | Priority: high | Version: 1.2 | Updated: 2026-08-06 (v1.2: desajuste de administración de usuarios marcado como resuelto — fase C) -->

# Business ↔ Tech Bridge

> Document how business needs translate to technical solutions. This is the critical connection point.

## Quick Reference

- **Purpose**: Show stakeholders technical choices serve business goals
- **Purpose**: Show developers business constraints drive architecture
- **Update When**: New features, refactoring, business pivot

## Core Mapping

| Business Need | Technical Solution | Why This Mapping | Business Value |
|---------------|-------------------|------------------|----------------|
| Manage prompts across multiple AI platforms | Prompt model + 6 N:M junction tables (Category, Tag, Platform, ClientProject, UseCase, ModelHint) with compound keys `@@id` | AI prompts need flexible categorization across multiple dimensions; junction tables allow unlimited relations per prompt | Users find prompts faster by filtering across 8 dimensions; taxonomy adapts as new platforms emerge |
| Search and discover prompts quickly | Full-text search across title/description/body/prePrompt/manualDeUso + 8 filter dimensions (categoryIds, tagIds, platformIds, status, isFavorite, language, clientProjectIds, useCaseIds) via URL search params + Prisma `where` queries | Filter state is URL-driven (shareable, bookmarkable); Prisma `where` + `orderBy` for efficient server-side querying | Reduces time spent searching through chat histories; URL-driven filters enable sharing filtered views |
| Export and import prompts between environments | JSON v2.0 with N:M relations (arrays of names) + dual parser for v1.0 legacy strings + upsert by userId+id or userId+title + `$transaction` for atomicity | Backwards compatibility required for existing users; dual parser handles both old and new formats; `$transaction` ensures data integrity | Data portability — users migrate between instances without losing taxonomy; safe re-import without duplicates |
| Control access and protect data | NextAuth.js + Credentials + JWT + middleware route protection + user roles (user/admin) + ownership checks per resource | Credentials-only auth for simplicity (no OAuth complexity); middleware for declarative route protection; ownership checks at API level | User data is isolated; admin can manage all content; middleware prevents unauthorized access at network level |

## Feature Mapping Examples

### Feature: Multi-dimensional Filtering

**Business Context**:
- User need: Find prompts by platform, category, tags, use case, client project, model hint, status, language, and favorites — often in combination (AND logic)
- Business goal: Minimize time-to-find for prompt library users; make filtering intuitive
- Priority: High — core differentiator of a structured prompt database vs. plain file storage

**Technical Implementation**:
- Solution: Prisma `where` clauses built from URL search params; AND logic across 8 filter dimensions (categoryIds, tagIds, platformIds, status, isFavorite, language, clientProjectIds, useCaseIds); multi-select for Platform, Category, Tags, Status, Language, Client/Project, and Use Case
- Architecture: Server component reads `searchParams` from URL → builds Prisma query → returns filtered results; client-side `PromptFilters` component uses `useSearchParams` + `router.push` to update URL params
- Trade-offs: URL params can get long with many filters; no saved filter presets yet; multi-select is checkbox-based (not dropdown multi-select for scalability)

**Connection**:
Without this feature, users would scroll through hundreds of untagged prompts or rely on browser find-in-page. The URL-driven approach enables bookmarking a specific filtered view (e.g., `/prompts?status=TESTED&language=en&isFavorite=true`) — a key workflow for users who curate prompt libraries.

### Feature: View Mode Preference

**Business Context**:
- User need: Switch between card view (visual, rich preview) and list view (dense, compact) when browsing prompts
- Business goal: Accommodate both visual browsers (cards) and power users (list) without losing state between sessions
- Priority: Medium — improves UX but not critical for core functionality

**Technical Implementation**:
- Solution: `ViewModeContext` (React context) + `PATCH /api/user/preferences` endpoint + persisted to `User.promptListViewPreference` in DB (default `"cards"`)
- Architecture: Server component reads DB preference → passes as `initialViewMode` to `ViewModeProvider` → client-side toggle writes preference via `PATCH` request; toggle component (`ViewToggle`) available next to page title
- Trade-offs: Server-side preference requires authenticated PATCH request (unauthenticated `GET /api/user/preferences` returns default); no localStorage fallback for anonymous users; preference is global, not per-page

**Connection**:
The preference persists across sessions — a logged-in user who prefers list view doesn't need to toggle each visit. Without this, users would reset to card view on every new session.

## Trade-off Decisions

| Situation | Business Priority | Technical Priority | Decision | Rationale |
|-----------|-------------------|-------------------|----------|-----------|
| User registration openness | Easy onboarding (anyone can sign up with valid name/email/password) | Security (prevent abuse, spam, bots) | Open registration with basic zod validation only (no invite, captcha, email verification) | Simple app; no paid tier; abuse not yet a concern; email+password minimum length validation as light gate |
| Backend-first development | Deliver export/import features faster by focusing on API | Complete full-stack (FE + BE) for all endpoints | Backend API first, UI later for non-critical endpoints | `/api/users` + `/api/users/[id]` (GET/PUT/DELETE) exist but have no admin user management page; documented as incomplete. **Resolved (2026-08-06, Phase C)**: the "Usuarios" tab in the profile (admin-only) manages users — create with role and initial password, edit name/password, deactivate/reactivate, delete |
| Filter state approach | Users want persistent, shareable filters | Avoid complex client-state management | URL search params as single source of truth for filter state | URL is inherently shareable and bookmarkable; eliminates need for Redux/Zustand for filter state; trade-off: params can get long |

## Common Misalignments

| Misalignment | Warning Signs | Resolution Approach |
|--------------|---------------|---------------------|
| Backend endpoints without frontend UI | API routes for users CRUD exist (`/api/users`, `/api/users/[id]`) but no admin user management page | **Resolved (2026-08-06, Phase C)**: the "Usuarios" tab in the profile (admin-only) implements full user management (create, edit, deactivate/reactivate, delete). Previous approach (document as incomplete; create admin page when it becomes a business priority) is kept as historical record |
| Server component duplication | `getPrompts` logic is duplicated between `app/(app)/prompts/page.tsx` (server component) and `app/api/prompts/route.ts` (API route) | Extract shared Prisma query logic to `lib/queries/prompts.ts` to eliminate drift between server-side render and API responses |

## Related Files

- `project-intelligence/technical-domain.md` - Technical implementation details
- `project-intelligence/decisions-log.md` - Decisions made with full context

## Evolución

- **v1.2 (2026-08-06)**: marcado como resuelto el desajuste «no existe página de administración de usuarios» (fase C): la pestaña "Usuarios" del perfil (solo admin) implementa la gestión completa de usuarios (alta con rol y contraseña inicial, edición, desactivación o reactivación y eliminación). Se actualizaron la fila de decisiones de compensación "Backend-first development" y la fila de desajustes comunes "Backend endpoints without frontend UI"; el texto anterior se conserva como registro histórico con nota de resolución.
