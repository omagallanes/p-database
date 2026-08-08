<!-- Context: core/navigation | Priority: critical | Version: 2.0 | Updated: 2026-08-08 -->

# Task Management Navigation

**Purpose**: JSON-driven task breakdown and tracking system

**Last Updated**: 2026-02-14

---

## Structure

```
core/task-management/
├── navigation.md
├── standards/
│   └── task-schema.md           # Base JSON schema (v1.0)
├── guides/
│   ├── splitting-tasks.md       # Task decomposition
│   └── managing-tasks.md        # Workflow guide
└── lookup/
    └── task-commands.md         # CLI script reference

Skill asociada (fuera del contexto):
.opencode/skills/task-management/
├── SKILL.md                     # Skill definition
├── router.sh                    # CLI router (bash)
└── scripts/
    └── task-cli.ts              # CLI implementation (TypeScript)
```

---

## Quick Routes

| Task | Path | Priority |
|------|------|----------|
| **Understand base schema** | `standards/task-schema.md` | ⭐⭐⭐⭐⭐ |
| **Split a feature** | `guides/splitting-tasks.md` | ⭐⭐⭐⭐⭐ |
| **Manage task lifecycle** | `guides/managing-tasks.md` | ⭐⭐⭐⭐ |
| **Use CLI commands** | `lookup/task-commands.md` | ⭐⭐⭐⭐ |
| **Load the skill** | `.opencode/skills/task-management/SKILL.md` | ⭐⭐⭐⭐ |

---

## Loading Strategy

### For Creating Basic Tasks:
1. Load `standards/task-schema.md` (understand base structure)
2. Load `guides/splitting-tasks.md` (decomposition approach)
3. Reference `lookup/task-commands.md` (validate after creation)

### For Managing Tasks:
1. Load `guides/managing-tasks.md` (workflow)
2. Reference `lookup/task-commands.md` (CLI usage)

---

## Related

- **Active tasks** → `.tmp/tasks/{feature}/` (at project root)
- **Completed tasks** → `.tmp/tasks/completed/{feature}/`
- **TaskManager agent** → `.opencode/agent/subagents/core/task-manager.md`
- **Skill files** → `.opencode/skills/task-management/` (`SKILL.md`, `router.sh`, `scripts/task-cli.ts`)
- **Core navigation** → `../navigation.md`

---

## Notas de versión

- **v2.0 (2026-08-08)**: se eliminan las referencias a `standards/enhanced-task-schema.md`, a `../workflows/multi-stage-orchestration.md` y al directorio `.opencode/agent/subagents/planning/` porque no existen en el disco. Se añaden los archivos reales de la skill (`SKILL.md`, `router.sh`, `scripts/task-cli.ts`) al árbol de estructura y a las rutas rápidas.
- **v1.0 (2026-02-15)**: versión original; incluía referencias a un esquema ampliado, orquestación en varias etapas y agentes de planificación que no existen en el disco y se retiraron en la versión 2.0.
