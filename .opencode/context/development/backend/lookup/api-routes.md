<!-- Context: development/backend/lookup | Priority: medium | Version: 1.0 | Updated: 2026-07-14 -->

# Lookup: All API Routes

**Purpose**: Quick reference for all 18 API endpoints. Auth required unless noted.

| Route | Methods | Auth | Purpose |
|-------|---------|------|---------|
| `/api/auth/[...nextauth]` | GET, POST | No | NextAuth.js handlers |
| `/api/auth/register` | POST | No | User registration (Zod + bcrypt) |
| `/api/prompts` | GET, POST | POST | List (all users) / Create prompt |
| `/api/prompts/[id]` | GET, PUT, DELETE | PUT/DELETE | Get / Update / Delete (ownership check) |
| `/api/prompts/[id]/usage` | PATCH | No | Increment `usageCount`, set `lastUsedAt` |
| `/api/categories` | GET, POST | POST | List / Create category |
| `/api/categories/[id]` | PUT, DELETE | PUT/DELETE | Update / Delete (admin for delete) |
| `/api/tags` | GET, POST | POST | List / Create tag |
| `/api/tags/[id]` | PUT, DELETE | PUT/DELETE | Update / Delete (admin for delete) |
| `/api/platforms` | GET, POST | POST | List / Create platform |
| `/api/model-hints` | GET, POST | POST | List / Create model hint |
| `/api/client-projects` | GET, POST | POST | List / Create client project |
| `/api/use-cases` | GET, POST | POST | List / Create use case |
| `/api/export/prompts` | GET | Yes | Export all user prompts as JSON v2.0 |
| `/api/import/prompts` | POST | Yes | Import JSON v1.0/v2.0 (dual parser) |
| `/api/user/preferences` | GET, PATCH | PATCH | View mode preference CRUD |
| `/api/users` | GET, PUT | Admin | List / update users (no frontend) |
| `/api/users/[id]` | DELETE | Admin | Delete user (no frontend) |

**Ownership model**: GET prompts list = all users' prompts. GET/PUT/DELETE by ID = owner or admin. Admin routes: `/api/users`, `/api/users/[id]`.

**Reference**: `app/api/` directory, `technical-domain.md` API Routes section
