<!-- Context: project-intelligence/development/task-delegation | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Concept: CodeReviewer Gate per Subtask

**Core Idea**: Each coding subtask must pass CodeReviewer approval BEFORE the next subtask begins. This catches issues early and prevents error accumulation.

**Key Points**:
- Per-subtask flow: Read → CoderAgent → `npx tsc --noEmit` → CodeReviewer → APPROVED → next subtask
- If CodeReviewer rejects → CoderAgent fixes → re-review loop
- Applies to ALL subtasks, not just at phase end
- Caught M-01 (missing `findUnique` mock) that would have reached production otherwise
- Cost: ~1 minute per review. Prevents errors that take hours to debug.

**Delegation Pattern**:
```
1. Read task.json + files to modify
2. Delegate to CoderAgent → implements changes
3. CoderAgent runs `npx tsc --noEmit` → verify compilation
4. Delegate to CodeReviewer → review quality, types, imports
5. CodeReviewer APPROVED → next subtask
```

**Same-File Rule**: If two tasks modify the same file, they MUST execute in the same batch to prevent merge conflicts.

**Reference**: `docs/technical-development-knowledge/PCI-plan-c-completo.md` §7.3

**Related**:
- guides/refactor-large-components.md
- technical-domain.md (Code Patterns)
