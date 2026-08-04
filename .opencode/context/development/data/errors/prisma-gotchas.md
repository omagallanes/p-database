<!-- Context: development/data/errors | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Errors: Common Prisma Gotchas

**Purpose**: Known Prisma issues in this project and how to avoid them.

---

## Cascade Deletes on Junction Tables

All 6 junction tables have `onDelete: Cascade` on **both** foreign keys:
```prisma
prompt   Prompt @relation(fields: [promptId], references: [id], onDelete: Cascade)
tag      Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
```
**Implication**: Deleting a Prompt removes all its tags/categories/platforms/etc. Deleting a Tag removes ALL prompts' association with that tag. **Irreversible without backup.**

---

## Seed Passwords in Plain Text

`prisma/seed.ts` contains hardcoded bcrypt-hashed passwords derived from plain text (`G4VK2F56FTS96YDG`, `281116pDB`). These credentials are committed to git history.

**Fix**: Use `process.env.ADMIN_PASSWORD` / `process.env.USER_PASSWORD` with dev fallback.

---

## Migration History Gitignored

`/prisma/migrations/` is in `.gitignore` — migration files are NOT in the repository.

**Impact**: Fresh clones must run `npx prisma migrate dev` to generate local migrations. No migration history visible in PRs.

---

## Prisma Client Stale on Deploy

If `prisma generate` doesn't run after `npm install` in CI/deploy, Prisma Client throws "Client not found" error.

**Fix**: Ensure `"postinstall": "prisma generate"` is in `package.json` scripts.

---

## outdated Binary Targets

Binary targets include `linux-musl-openssl-3.0.x` and `debian-openssl-3.0.x`. If deployment platform uses different OpenSSL version, Prisma fails to connect.

**Fix**: Verify OpenSSL version on target platform and add/remove binary targets accordingly.

**Reference**: `prisma/schema.prisma`, `project-intelligence/living-notes.md`
