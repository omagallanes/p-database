---
source: Context7 API + Official Vercel Docs
library: Vercel
package: vercel
topic: Project Linking & Setup
fetched: 2026-07-17T14:20:00Z
official_docs: https://vercel.com/docs/cli/project-linking
---

# Vercel Project Linking & Setup

## What is Project Linking?

When you run `vercel link` (or `vercel` for the first time), Vercel CLI creates a `.vercel` directory containing:

- `.vercel/project.json` with `orgId` and `projectId`
- `.vercel/README.txt`

This links your local directory to a Vercel Project. Once linked, the CLI knows which team and project to deploy to.

## How Linking Works

### Auto-detection
When you run `vercel`, the CLI searches the selected team for an existing project matching your local directory name (after slugifying).

```bash
vercel

  Set up "~/web/my-lovely-project"
? Which team? My Awesome Team
? Found project "awesome-team/my-lovely-project". Link to it? [Y/n] y
  Linked      awesome-team/my-lovely-project
```

### Manual linking
If no project matches (or you decline), you can manually specify:

```bash
vercel

  Set up "~/web/release-notes"
? Which team? My Awesome Team
? Link to existing project? [y/N] y
? Existing project name? marketing-site
  Linked      awesome-team/marketing-site
```

### Non-interactive linking (for CI/CD)
```bash
vercel link --yes
vercel link --yes --project prompt-database   # Specify project by name or ID
```

## Setting Up for CI/CD Without Interactive Linking

Instead of running `vercel link` interactively, set these environment variables:

```bash
export VERCEL_ORG_ID=team_YqXCQfncAM8g3lDJP80NP8uS
export VERCEL_PROJECT_ID=prj_cu98UkNifYkmPNO0aLxYjqCHYWO1
export VERCEL_TOKEN=vcp_YOUR_TOKEN_HERE
```

Then you can run:
```bash
vercel deploy --prod --non-interactive
```

The `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` variables **replace the need for project linking** in CI/CD environments.

## Specifying the Project

You have **three ways** to specify which Vercel Project to use (precedence order):

| Method | Example |
|--------|---------|
| 1. `--project` flag (highest) | `vercel deploy --project prompt-database` |
| 2. `VERCEL_PROJECT_ID` env var | `VERCEL_PROJECT_ID=prj_xxx vercel deploy` |
| 3. `.vercel/project.json` (linking) | Created by `vercel link` |

Both `--project` and `VERCEL_PROJECT_ID` accept a **project name** or **project ID**.

## Understanding `.vercel/project.json`

When you open your existing `.vercel/project.json`, you should see:

```json
{
  "orgId": "team_YqXCQfncAM8g3lDJP80NP8uS",
  "projectId": "prj_cu98UkNifYkmPNO0aLxYjqCHYWO1"
}
```

This file **is already correct** — it contains the right team and project IDs. When this file exists in your project, commands like `vercel deploy` automatically target this team and project, so you generally **don't need** `--scope` or `--team` flags.

## Specifying the Team

Use these options when you need to target a different team:

| Option | Shorthand | Expects | Example |
|--------|-----------|---------|---------|
| `--scope` | `-S` | **Team slug** only | `--scope my-team-slug` |
| `--team` | `-T` | Team slug OR team ID | `-T team_YqXCQfncAM8g3lDJP80NP8uS` |

> **Critical:** `--scope` requires a **team slug** (e.g., `my-awesome-team`), not a team ID (`team_...`). Using a team ID with `--scope` causes "You do not have access to the specified account". If you need to use a team ID, use `--team` / `-T` instead.

## Day-to-Day Workflow After Initial Setup

Once `.vercel/project.json` exists:

```bash
# Preview deployment
vercel deploy

# Production deployment
vercel deploy --prod
```

No need for `--scope`, `--team`, or re-linking after the initial setup.
