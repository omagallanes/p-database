<!-- Context: project-intelligence/lookup | Priority: low | Version: 1.2 | Updated: 2026-08-06 -->

# Lookup: Decision Details & Alternatives

**Purpose**: Detailed alternatives, related commits, and references extracted from `decisions-log.md` to keep it under 200 lines.

---

## 1. SQLite → PostgreSQL

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Stay with SQLite | Zero migration cost | No concurrency/serverless/pooling | Blocker for Vercel deploy |
| MySQL | Widely used, good Prisma | Weaker Prisma adapter vs PG | Inferior Prisma ecosystem |

Related: `prisma/schema.prisma`, `.env.development`, `prisma/migrate-data.ts`

---

## 2. Railway → Vercel

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Railway (keep) | Working deployment | Docker complexity, less PG integration | Overhead not worth it |
| VPS (Hetzner) | Full control, predictable cost | Server maintenance, SSL, patching | Excessive overhead |

Related: `vercel.json`, `next.config.js`, `.env.vercel`, `docker-compose.yml`

---

## 3. String Fields → N:M Junction Tables

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Keep string fields | Minimal change | No referential integrity, single-value | Limits data quality |
| JSON array field | Flexible, no new tables | No FKs, complex indexing | Prisma JSON less mature |

Related: `prisma/schema.prisma` (junction tables), `prisma/migrate-data.ts`, commit `581fdee`

---

## 4. NextAuth.js JWT + Credentials

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| OAuth-only providers | Social login UX | Needs OAuth setup per provider | Not available at start |
| Clerk | Full-featured | External dep, paid limits, vendor lock-in | Overkill for email/password |
| Custom auth (bcrypt+sessions) | Full control, zero deps | Security edge cases, no CSRF | Unnecessary reinvention |

Related: `lib/auth.ts`, `middleware.ts`, `types/next-auth.d.ts`, `app/api/auth/register/route.ts`

---

## 5. shadcn/ui + TailwindCSS

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Material UI (MUI) | Comprehensive, well-documented | Heavy, opinionated, Material lock-in | Too heavy, difficult Tailwind theming |
| Chakra UI | Good DX, accessible | Separate paradigm from Tailwind | Doesn't leverage Tailwind investment |
| Ant Design | Enterprise set | Heavy, complex theming | Poor Tailwind integration |

Related: `components/ui/` (8 files), `tailwind.config.ts`, `app/globals.css`

---

## 6. KILO → OAC

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Keep KILO | No migration cost, familiarity | Custom/unmaintained, undocumented | Technical debt |
| Plain OpenCode | No migration, keep current | No agent orchestration, no gates | Lacks OAC workflow management |

Related: `.opencode/`, commit `37bb4b8`, `reglas-abreviaciones.txt`

---

## 7. VPS/Hetzner/Traefik Infrastructure

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| Keep VPS as secondary | Redundancy, full control | Duplicate maintenance, SSL/security | Unnecessary overhead |
| Keep both VPS and Vercel | Flexible, gradual migration | Confusing, split CI/CD | Clarity > flexibility |

Related: commit `37bb4b8`, `docker-compose.yml` (retained for local PG), `Dockerfile` (outdated)

---

## 11. Preferencias de interfaz en cuenta (no localStorage)

| Alternative | Pros | Cons | Why Rejected? |
|-------------|------|------|---------------|
| localStorage | Instantáneo, cero red, offline | No homologa entre dispositivos/navegadores | "así todo está homologado" (usuario) |
| Cookie de preferencias | Síncrona con la sesión | Tamaño limitado, sin estructura tipada | JSON en BD más simple y escalable |

Related: `contexts/UIContext.tsx`, `lib/ui-preferences.ts`, `app/api/user/preferences/route.ts`

---

## Deprecated Decisions

| Decision | Replaced By | Why |
|----------|-------------|-----|
| Railway deployment with Docker | Vercel (D2) | Docker complexity > value |
| SQLite as primary DB | PostgreSQL (D1) | Unfit for production/serverless |
| String fields for prompt metadata | N:M junctions (D3) | Needed integrity + multi-value |
| KILO agent framework | OAC (D6) | Standardization |
| VPS/Hetzner self-hosting | Vercel (D2) | Eliminated unused infra |

---

## Reference

Source: `decisions-log.md` — compacted version
