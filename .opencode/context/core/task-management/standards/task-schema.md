<!-- Context: core/task-schema | Priority: critical | Version: 1.0 | Updated: 2026-02-15 -->

# Standard: Task JSON Schema

**Purpose**: JSON schema reference for task management files

**Last Updated**: 2026-02-14

---

## Core Concepts

Task management uses two JSON file types:
- `task.json` — Feature-level metadata and tracking
- `subtask_NN.json` — Individual atomic tasks with dependencies

Location: `.tmp/tasks/{feature-slug}/` (at project root)

---

## Schema Versions

This document describes the **base schema** (v1.0) that all task files must follow.

For **enhanced features** (line-number precision, domain modeling, contracts, ADRs, prioritization):
- See `enhanced-task-schema.md` for extended fields
- All enhanced fields are **optional** and backward compatible
- Use enhanced schema for multi-stage orchestration workflows

---

## task.json Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | kebab-case identifier |
| `name` | string | Yes | Human-readable name (max 100) |
| `status` | enum | Yes | active / completed / blocked / archived |
| `objective` | string | Yes | One-line objective (max 200) |
| `context_files` | array | No | **Standards paths only** — conventions, patterns, security rules |
| `reference_files` | array | No | **Source material only** — existing code, config, schemas |
| `exit_criteria` | array | No | Completion conditions |
| `subtask_count` | int | No | Total subtasks |
| `completed_count` | int | No | Done subtasks |
| `created_at` | datetime | Yes | ISO 8601 |
| `completed_at` | datetime | No | ISO 8601 |

---

## subtask_NN.json Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | {feature}-{seq} |
| `seq` | string | Yes | 2-digit (01, 02) |
| `title` | string | Yes | Task title (max 100) |
| `status` | enum | Yes | pending / in_progress / completed / blocked |
| `depends_on` | array | No | Sequence numbers of dependencies |
| `parallel` | bool | No | True if can run alongside others |
| `context_files` | array | No | **Standards paths only** — conventions and patterns |
| `reference_files` | array | No | **Source material only** — existing files |
| `suggested_agent` | string | No | Recommended agent (e.g., OpenFrontendSpecialist) |
| `acceptance_criteria` | array | No | Binary pass/fail conditions |
| `deliverables` | array | No | Files to create/modify |
| `agent_id` | string | No | Set when in_progress |
| `started_at` | datetime | No | ISO 8601 |
| `completed_at` | datetime | No | ISO 8601 |
| `completion_summary` | string | No | What was done (max 200) |

---

## Status Transitions

```
pending → in_progress   (by working agent, when deps satisfied)
in_progress → completed (by TaskManager, after verification)
* → blocked             (when issue found)
blocked → pending       (when unblocked)
```

---

## Parallel Flag

- `parallel: true` = Isolated task, can run alongside others
- `parallel: false` = May affect shared state, run sequentially

Use `task-cli.ts parallel` to find parallelizable ready tasks.

---

## context_files vs reference_files — The Rule

These two fields serve fundamentally different purposes. **Never mix them.**

| Field | Answers | Contains | Agent behavior |
|-------|---------|----------|----------------|
| `context_files` | "What rules do I follow?" | Standards, conventions, patterns from `.opencode/context/` | Load and apply as coding guidelines |
| `reference_files` | "What existing code do I look at?" | Project source files, configs, schemas | Read to understand existing patterns |

**Correct example** — clean separation:
```json
"context_files": [
  ".opencode/context/core/standards/code-quality.md",
  ".opencode/context/core/standards/security-patterns.md"
],
"reference_files": [
  "package.json",
  "src/existing-auth.ts"
]
```

Do NOT mix standards into `reference_files` or source files into `context_files`.

---

## Example

```json
{
  "id": "auth-system-02",
  "seq": "02",
  "title": "Create JWT service",
  "status": "pending",
  "depends_on": ["01"],
  "parallel": false,
  "context_files": [
    ".opencode/context/core/standards/code-quality.md",
    ".opencode/context/core/standards/security-patterns.md"
  ],
  "reference_files": [
    "src/auth/token-utils.ts"
  ],
  "acceptance_criteria": ["JWT tokens signed with RS256", "Tests pass"],
  "deliverables": ["src/auth/jwt.service.ts"]
}
```

---

## Migration to Enhanced Schema

The enhanced schema adds features while maintaining full backward compatibility.

**When to use**:
- Line-number precision for large context files (reduces cognitive load)
- Domain modeling — bounded_context, module, vertical_slice fields
- Contract tracking — API/interface dependencies
- Design artifacts — Figma, wireframes, mockups
- ADR references — connect architecture decisions to tasks
- Prioritization — RICE/WSJF scoring for release planning

**Migration path**:
1. No changes required — existing files work as-is
2. Add enhanced fields incrementally (start with line-number precision, then domain, contracts, prioritization)
3. Old and new formats can mix in the same file

**Example — adding line-number precision**:

Old format (still valid):
```json
"context_files": [".opencode/context/core/standards/code-quality.md"]
```

New format (enhanced):
```json
"context_files": [
  { "path": ".opencode/context/core/standards/code-quality.md", "lines": "53-95", "reason": "Pure function patterns for service layer" }
]
```

Both formats work. Agents handle both automatically.

---

## Related

- `enhanced-task-schema.md` — Extended schema with advanced features
- `../guides/splitting-tasks.md` — How to decompose features
- `../guides/managing-tasks.md` — Lifecycle workflow
- `../lookup/task-commands.md` — CLI reference
