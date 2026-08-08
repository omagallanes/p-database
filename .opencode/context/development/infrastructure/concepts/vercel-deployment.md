<!-- Context: development/infrastructure/concepts | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Vercel + Neon Deployment

**Core Idea**: Deployed on Vercel (Hobby tier) with PostgreSQL on Neon (free tier). Next.js standalone output format, Prisma with multiplatform binary targets. Auto-deploy disabled on main branch.

**Key Points**:
- **Vercel Hobby limits**: 100 GB bandwidth, 100 GB-hr execution, 10s function timeout
- **Neon free tier**: 512 MB storage, 60 concurrent connections, auto-pause on inactivity
- **PostgreSQL connection**: `DATABASE_URL` for Prisma (pooled), `DATABASE_URL_UNPOOLED` for Neon direct connections
- **Build**: `npm run build` generates `.next/standalone` output (`output: "standalone"` in next.config.js)
- **Prisma**: `postinstall: prisma generate` must be in package.json; binaryTargets include linux-musl for serverless
- **Environment**: `.env.vercel` contains all Neon/PostgreSQL variables for import into Vercel dashboard
- **Deploy**: `git push` triggers Vercel auto-deploy (main branch disabled via `vercel.json`)

**Vercel config** (`vercel.json`):
```json
{
  "git": { "deploymentEnabled": { "main": false } }
}
```

**Required env vars**:
```
DATABASE_URL=postgresql://...  # Prisma pooled URL
DATABASE_URL_UNPOOLED=postgresql://...  # Neon direct connection
AUTH_SECRET=<generated with openssl rand -base64 32>
AUTH_URL=https://your-app.vercel.app
NEXT_PUBLIC_BASE_PATH=""  # Root deployment
```

**Known issues**:
- Auth pages need `force-dynamic` or fail static pre-render
- Serverless cold starts add latency to first request
- Prisma binary targets must match Vercel runtime (linux-musl-openssl-3.0.x)

**Reference**: `vercel.json`, `next.config.js`, `.env.vercel`, `../../project-intelligence/lookup/decisions-log.md`
