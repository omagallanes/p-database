<!-- Context: project-intelligence/development/lookup-commands | Priority: low | Version: 1.2 | Updated: 2026-08-06 (v1.2: cifras de pruebas actualizadas a 388 en 40 suites) -->

# Lookup: Plan C Commands

**Core Idea**: Quick reference of commands used during Plan C execution and verification.

## Verification
```bash
npm test                        # 388 tests, 40 suites
npm test -- --testPathPattern="import"
npm test -- --testPathPattern="PromptFilters"
npm test -- --testPathPattern="prompts-\[id\]"
npm run lint                    # 0 no-unused-vars
npm run build                   # Compiled successfully
npx tsc --noEmit                # 0 TS errors
```

## Git
```bash
git log --oneline -10
git diff 8c37bec^..8c37bec      # F1 diff
git diff 866c866^..866c866      # F1 (M-01)
git diff 3072d07^..3072d07      # F2 diff
git diff 006a615^..006a615      # F3 diff
git tag -l "fase*"              # List tags
git diff-tree --no-commit-id -r <sha> --name-only
```

## Deploy
```bash
source .env && npx vercel --prod --token="$VERCEL_TOKEN"
```

## Migración BD (Neon, sin BD local)
```bash
# NO hay BD local: la única BD es Neon (producción). No hay carpeta prisma/migrations (gitignored).
set -a; source .env.local; set +a      # DATABASE_URL → Neon
npx prisma db push                     # aplica cambios del schema directamente a Neon
npx prisma generate                    # regenera el cliente Prisma
```

## Dump DB
```bash
pg_dump --no-owner --no-acl "postgresql://..." > temp/plan-c/dump-bd.sql
```

## Task CLI
```bash
bash .opencode/skills/task-management/router.sh status
bash .opencode/skills/task-management/router.sh next <feature-name>
bash .opencode/skills/task-management/router.sh validate
bash .opencode/skills/task-management/router.sh blocked
```

**Reference**: `docs/technical-development-knowledge/PCI-plan-c-completo.md` §6

## Evolución

- **v1.2 (2026-08-06)**: cifras de verificación actualizadas a las reales — 388 pruebas en 40 suites (antes 56 en 8 suites). Los comandos no cambian.
- **v1.1 (2026-08-06)**: versión anterior, conservada en las secciones precedentes.
