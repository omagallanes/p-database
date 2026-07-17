---
source: Context7 API + Official Vercel Docs
library: Vercel
package: vercel
topic: CLI Deployment Workflow
fetched: 2026-07-17T14:20:00Z
official_docs: https://vercel.com/docs/projects/deploy-from-cli
---

# Vercel CLI Deployment Workflow

## Command Sequence for Full Deployment

### Quick Reference (already linked project)

```bash
# If already linked (.vercel/project.json exists), just:
export VERCEL_TOKEN=vcp_YOUR_TOKEN_HERE

# Deploy preview first
vercel deploy

# Verify preview
vercel curl / --deployment <preview-url>

# Deploy to production
vercel deploy --prod
```

### Full Setup + Deploy Workflow

```bash
# 1. Link your local directory to a Vercel project (creates .vercel/project.json)
vercel link

# 2. Pull environment variables for local development
vercel env pull .env.local

# 3. Develop locally
vercel dev

# 4. Deploy a preview
vercel deploy

# 5. Verify the preview
vercel curl / --deployment <preview-url>
vercel logs --deployment <preview-deployment-id> --level error

# 6. Deploy to production
vercel deploy --prod

# 7. Configure custom domain (if needed)
vercel domains add example.com

# 8. Confirm production is live
vercel curl / --deployment <production-url>
vercel logs --environment production --level error --since 5m
```

## `vercel deploy` vs `vercel --prod` vs `vercel` (no subcommand)

| Command | Behavior |
|---------|----------|
| `vercel` | Same as `vercel deploy` — creates a **preview deployment**. Default command when no subcommand is specified. |
| `vercel deploy` | Explicit version of `vercel` — creates a **preview deployment**. |
| `vercel --prod` | Shortcut for `vercel deploy --prod` — creates a **production deployment** targeting the production domain. |
| `vercel deploy --prod` | Explicit production deployment. Builds and deploys to the production environment. |
| `vercel deploy --target=staging` | Deploys to a custom environment (if configured). |

## Non-Interactive / CI/CD Deployment

For CI/CD pipelines, use `--non-interactive` (or `--yes`) to skip prompts:

```bash
export VERCEL_TOKEN=vcp_YOUR_TOKEN_HERE
export VERCEL_ORG_ID=team_YqXCQfncAM8g3lDJP80NP8uS
export VERCEL_PROJECT_ID=prj_cu98UkNifYkmPNO0aLxYjqCHYWO1

# Link (non-interactive) — only needed once
vercel link --yes

# Deploy preview
vercel deploy --non-interactive

# Deploy production
vercel deploy --prod --non-interactive
```

## Deploying with a Specific Team

Use the `--scope` flag with the **team SLUG** (not the team ID):

```bash
vercel deploy --prod --token vcp_TOKEN --scope my-team-slug
```

Or use the `--team` flag with the team slug or team ID:

```bash
vercel deploy --prod --token vcp_TOKEN --team team_YqXCQfncAM8g3lDJP80NP8uS
```

> **Important:** `--scope` expects a **team slug** (e.g., `my-team`), not a team ID (`team_...`). Use `--team` if you need to use a team ID.

## After Git Integration is Set Up

If you connect a Git repository, Vercel automatically creates preview deployments for every push and pull request. Your day-to-day workflow simplifies to:

1. Make changes locally
2. Deploy a preview: `vercel deploy`
3. Verify the preview
4. Ship to production: `vercel deploy --prod`

## Deployment Options

| Option | Description |
|--------|-------------|
| `--prod` | Deploy to production domain |
| `--prebuilt` | Deploy prebuilt output (from `vercel build`) |
| `--archive=tgz` | Compress files before upload (for large projects) |
| `--force` | Skip build cache |
| `--logs` | Show build logs during deployment |
| `--no-wait` | Exit immediately without waiting for build |
| `--public` | Make source code publicly accessible |
| `--regions sfo1` | Deploy functions to specific regions |
| `--env KEY=val` | Set runtime environment variable |
| `--build-env KEY=val` | Set build-time environment variable |
| `--skip-domain` | Don't auto-assign production domain (use with `--prod`) |
| `--target=staging` | Deploy to custom environment |
| `--meta KEY=val` | Add metadata to deployment |
| `--non-interactive` | Skip all prompts (for CI/CD) |
| `--yes` | Accept defaults for prompts |
| `--debug` | Verbose output |
