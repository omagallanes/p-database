<!-- Context: project-intelligence/development/guide-deploy | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

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

**Full reference**: `docs/guide/deployment.md` — Guía exhaustiva con:
- Configuración de VERCEL_TOKEN y bug conocido (`--token` vs env var)
- Flujo completo commit → push → deploy
- Verificación post-despliegue y rollback
- Solución de problemas con errores reales documentados
- Referencia rápida de comandos

