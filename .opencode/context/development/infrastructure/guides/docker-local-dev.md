<!-- Context: development/infrastructure/guides | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Guide: Local Development with Docker

**Purpose**: Run the full stack locally with PostgreSQL + hot-reload.

---

## Quick Start

```bash
docker compose -f docker-compose.dev.yml up --build
```

Opens at `http://localhost:3300`. Hot-reload via volume mounts.

## What It Includes

- **PostgreSQL 14** (Alpine) with healthcheck
- **Next.js dev server** with hot-reload (Dockerfile.dev)
- Source code mounted for live editing
- `node_modules` and `.next` excluded from mount (container-native)

## Dockerfile.dev

Single-stage, runs `npm run dev` directly:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev"]
```

## Production Docker (Legacy - May Be Broken)

The production `Dockerfile` uses multi-stage build with `standalone` output, but:
- References deleted `docker-entrypoint.sh` → **build fails**
- Uses SQLite (`DATABASE_URL="file:/app/data/prod.db"`) — no PostgreSQL
- Has Traefik labels for VPS deployment (deprecated)

**Status**: Production Docker is currently unmaintained. Use Vercel for production deployment.

## Manual DB Commands

```bash
# Run migrations
docker compose -f docker-compose.dev.yml exec app npx prisma migrate dev

# Seed database
docker compose -f docker-compose.dev.yml exec app npm run db:seed

# View logs
docker compose -f docker-compose.dev.yml logs -f app
```

**Reference**: `Dockerfile`, `Dockerfile.dev`, `docker-compose.yml`, `docker-compose.dev.yml`
