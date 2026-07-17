---
source: Context7 API + Official Vercel Docs
library: Vercel
package: vercel
topic: CLI Authentication & Tokens
fetched: 2026-07-17T14:20:00Z
official_docs: https://vercel.com/docs/cli/global-options#token
---

# Vercel CLI Authentication & Token Usage

## How to Authenticate Vercel CLI Commands

You have **two ways** to authenticate Vercel CLI commands:

### 1. `--token` flag (shorthand `-t`)

```bash
vercel --token vcp_7ceTtedqEf96eTe7Mw32n9gjfSo23kHBHAbTrchMINrvUMZv0EXAMPLE
```

### 2. `VERCEL_TOKEN` environment variable (recommended for CI/CD)

```bash
export VERCEL_TOKEN=vcp_7ceTtedqEf96eTe7Mw32n9gjfSo23kHBHAbTrchMINrvUMZv0EXAMPLE
vercel deploy
```

**If both are provided, the `--token` flag takes precedence.**

## Why Use the Environment Variable?

Using `VERCEL_TOKEN` is **recommended for CI/CD pipelines** because it avoids exposing the token in command-line arguments, which can be visible in process lists and logs. The `--token` flag exposes the token in the process list.

## Token Format

All Vercel personal access tokens start with the `vcp_` prefix. This is the standard format for all Vercel tokens. Example:

```
vcp_7ceTtedqEf96eTe7Mw32n9gjfSo23kHBHAbTrchMINrvUMZv0EXAMPLE
```

## Token Types

Vercel tokens can have different scopes:

| Type | Description | Prefix |
|------|-------------|--------|
| **Classic Personal Access Token** | Full account-level access, user-scoped | `vcp_` |
| **Project-scoped Token** | Limited to a single project (created with `--project prj_xxx`) | `vcp_` |
| **Team-scoped Token** | Created on behalf of a team | `vcp_` |
| **OAuth2 Token** | Created via OAuth flow or `vercel login` | `vcp_` |

All token types use the same `vcp_` prefix — you **cannot distinguish the type by prefix alone**.

## Managing Tokens via CLI

### List tokens
```bash
vercel tokens ls
vercel tokens ls --format json   # Machine-readable output
```

### Create a new token
```bash
vercel tokens add "CI deploy"
```
> **Important:** Creating tokens requires a **classic personal access token** with account-level scope. OAuth sessions created by `vercel login` cannot mint new tokens, and team-only or project-only tokens will also be rejected.

### Scope token to a single project
```bash
vercel tokens add "Preview deploy bot" --project prj_abc123
```

### Revoke a token
```bash
vercel tokens rm tok_abc123
```

## Understanding Token Scopes & Permissions

From the Vercel REST API, tokens have a `scopes` array with `type` values:

- **`"user"` scope**: Token is tied to the user account; the user must be a member of any team they want to operate on
- Tokens inherit the permissions/RBAC role of the user who created them
- Team members need at minimum `DEVELOPER` role (or appropriate project-level `teamPermissions` like `FullProductionDeployment`) to deploy

## Troubleshooting "token not valid" Error

### Possible Causes

1. **Token was revoked or expired** → Check in Vercel Dashboard at https://vercel.com/account/tokens
2. **Token was created via OAuth (e.g., `vercel login`)** and is not a classic personal access token → Create a new token from the dashboard
3. **Token was project-scoped** and being used for a different project → Use the correct project or create an account-level token
4. **Token was team-scoped** and being used outside that team → Use the correct team scope
5. **Token string has formatting issues** → Ensure no extra whitespace, newlines, or quoting issues (especially in CI env vars)
6. **Token is for a different user account** → Verify the token was created by the same user who has access to the team

### Validate Your Token

You can check if your token is active using the Vercel API:

```bash
curl -X POST "https://api.vercel.com/login/oauth/token/introspect" \
  -d "token=vcp_YOUR_TOKEN_HERE"
```

A response with `"active": true` means the token is valid.

## Troubleshooting "You do not have access to the specified account" Error

1. **`--scope` expects a team SLUG, not a team ID** → Use `vercel --scope my-team-slug` (the URL-friendly name), NOT `vercel --scope team_abc123`
2. **`--team` option accepts team slug OR team ID** → Use `vercel deploy --team team_abc123def` or `vercel deploy -T team_abc123def`
3. **User account (token owner) is not a member of the team** → Have a team owner add you to the team
4. **User's role doesn't have sufficient permissions** → Ensure at minimum `DEVELOPER` role with `FullProductionDeployment` permission
