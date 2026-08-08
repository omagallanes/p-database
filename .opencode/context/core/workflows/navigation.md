<!-- Context: core/navigation | Priority: critical | Version: 1.1 | Updated: 2026-08-08 -->

# Core Workflows Navigation

**Purpose**: Process workflows for common development tasks

---

## Files

| File | Topic | Priority | Load When |
|------|-------|----------|-----------|
| `code-review.md` | Code review process | ⭐⭐⭐⭐ | Reviewing code |
| `task-delegation-basics.md` | Core delegation workflow | ⭐⭐⭐⭐ | Using task tool |
| `task-delegation-specialists.md` | When to delegate to whom | ⭐⭐⭐⭐ | Choosing specialist |
| `task-delegation-caching.md` | Context caching | ⭐⭐⭐ | Repeated tasks |
| `component-planning.md` | Component-based planning | ⭐⭐⭐⭐ | Complex features |
| `delegation.md` | Delegation context template | ⭐⭐⭐⭐ | Creating delegation context |
| `external-context-integration.md` | External context integration | ⭐⭐⭐⭐ | External packages |
| `external-context-management.md` | External context management | ⭐⭐⭐⭐ | Managing external docs |
| `external-libraries-scenarios.md` | Common scenarios | ⭐⭐⭐ | Examples needed |
| `external-libraries-faq.md` | Troubleshooting | ⭐⭐⭐ | Errors/questions |
| `feature-breakdown.md` | Breaking down features | ⭐⭐⭐⭐ | 4+ files, complex tasks |
| `review.md` | Code review guidelines | ⭐⭐⭐⭐ | Reviewing code (quick ref) |
| `session-management.md` | Managing sessions | ⭐⭐⭐ | Session cleanup |
| `design-iteration-overview.md` | Design workflow overview | ⭐⭐⭐⭐ | Starting design work |
| `design-iteration-plan-file.md` | Design plan template | ⭐⭐⭐⭐ | Creating design plan |
| `design-iteration-stage-layout.md` | Stage 1: Layout | ⭐⭐⭐ | Layout design |
| `design-iteration-stage-theme.md` | Stage 2: Theme | ⭐⭐⭐ | Theme design |
| `design-iteration-stage-animation.md` | Stage 3: Animation | ⭐⭐⭐ | Animation design |
| `design-iteration-stage-implementation.md` | Stage 4: Implementation | ⭐⭐⭐ | Implementation |
| `design-iteration-visual-content.md` | Visual content generation | ⭐⭐ | Image generation |
| `design-iteration-best-practices.md` | Best practices & troubleshooting | ⭐⭐⭐ | Quality check |
| `design-iteration-plan-iterations.md` | Plan file iterations | ⭐⭐⭐ | Managing iterations |

---

## Loading Strategy

**For code review**:
1. Load `code-review.md` (high)
2. Depends on: `../standards/code-quality.md`, `../standards/security-patterns.md`

**For task delegation**:
1. Load `task-delegation-basics.md` (high)
2. Load `task-delegation-specialists.md` (when choosing agent)

**For external libraries**:
1. Load `external-context-integration.md` (high)
2. Load `external-context-management.md` (high)
3. Reference `external-libraries-scenarios.md` for examples

**For complex features**:
1. Load `feature-breakdown.md` (high)
2. Load `component-planning.md` (high)
3. Depends on: `task-delegation-basics.md`

**For session management**:
1. Load `session-management.md` (medium)

---

## Related

- **Standards** → `../standards/navigation.md`
- **OpenAgents Control Delegation** → `../../openagents-repo/guides/subagent-invocation.md`

---

## Nota de versión

### Versión 1.1 — 2026-08-08
- Corregida la referencia a `external-libraries-workflow.md`: el archivo no existe en el disco. La sustituyen los archivos reales `external-context-integration.md` y `external-context-management.md`.
- Listados en la tabla los cinco archivos huérfanos que faltaban: `component-planning.md`, `delegation.md`, `external-context-integration.md`, `external-context-management.md` y `review.md`.
- Ajustada la estrategia de carga de librerías externas y de características complejas para usar los archivos reales.

### Versión 1.0 — 2026-02-15
- Versión original con la referencia a `external-libraries-workflow.md` (quedó como histórico; no existe en el disco) y sin listar los cinco archivos huérfanos.
