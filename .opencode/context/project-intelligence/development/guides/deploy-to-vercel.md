<!-- Context: project-intelligence/development/guide-deploy | Priority: medium | Version: 1.1 | Updated: 2026-08-06 -->

# Guide: Deploy to Vercel

**Core Idea**: Deploys are manual (auto-deploy disabled on `main`). Load vars from `.env` before deploying.

```bash
# Full deploy command
source .env && npx vercel --prod --token="$VERCEL_TOKEN"
```

**Key points**:
- `VERCEL_TOKEN` is in `.env` — must be loaded with `source .env` before the command
- Auto-deploy disabled: `"deploymentEnabled": { "main": false }` in `vercel.json`
- After deploy, verify production: `https://prompt-database-liard.vercel.app`
- HTTP 307 redirect on root is normal Vercel behavior (not an error)

**Pre-deploy checklist**:
```bash
npm test          # 56 tests, 8 suites, 0 failures expected
npm run lint      # 0 no-unused-vars expected
npm run build     # Compiled successfully expected
npx tsc --noEmit  # 0 errors expected
```

**Migración de schema — BD única Neon**:
- No hay `prisma/migrations` en el repo (gitignored); la BD única es Neon (producción) — no existe BD local.
- Procedimiento:
  1. `vercel env pull .env.local --environment=production` (descargar env de producción)
  2. Editar `prisma/schema.prisma`
  3. `source .env.local && npx prisma db push --accept-data-loss`
  4. `npx prisma generate`
  5. `source .env && npx vercel --prod`
- ⚠️ `--accept-data-loss` solo salta el aviso genérico de Prisma; campos nuevos con `@default` son seguros (no destruyen datos).

**Full reference**: `docs/guide/deployment.md` — Guía exhaustiva con:
- Configuración de VERCEL_TOKEN y bug conocido (`--token` vs env var)
- Flujo completo commit → push → deploy
- Verificación post-despliegue y rollback
- Solución de problemas con errores reales documentados
- Referencia rápida de comandos

