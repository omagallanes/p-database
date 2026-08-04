<!-- Context: openagents-repo/context-bundle-template | Priority: low | Version: 1.0 | Updated: 2026-02-15 -->

# Context Bundle Template

**Purpose**: Template for creating context bundles when delegating tasks to subagents
**Location**: `.tmp/context/{session-id}/bundle.md`
**Used by**: repo-manager agent when delegating to subagents

---

## Template

```markdown
# Context Bundle: {Task Name}

Session: {session-id}
Created: {ISO timestamp}
For: {subagent-name}
Status: in_progress

## Task Overview

{Brief description of what we're building/doing}

## User Request

{Original user request - what they asked for}

## Relevant Standards (Load These Before Starting)

**Core Standards**:
- `.opencode/context/core/standards/code.md` → Modular, functional code patterns
- `.opencode/context/core/standards/tests.md` → Testing requirements and TDD
- `.opencode/context/core/standards/docs.md` → Documentation standards
- (example: `.opencode/context/core/standards/patterns.md`) → Error handling, security patterns

**Core Workflows**:
- (example: `.opencode/context/core/workflows/delegation.md`) → Delegation process
- (example: `.opencode/context/core/workflows/task-breakdown.md`) → Task breakdown methodology
- (example: `.opencode/context/core/workflows/review.md`) → Code review guidelines

## Repository-Specific Context (Load These Before Starting)

**Quick Start** (ALWAYS load first):
- `.opencode/context/openagents-repo/quick-start.md` → Repo orientation

**Core Concepts** (Load based on task type):
- `.opencode/context/openagents-repo/core-concepts/agents.md` → How agents work
- `.opencode/context/openagents-repo/core-concepts/evals.md` → How testing works
- `.opencode/context/openagents-repo/core-concepts/registry.md` → How registry works
- `.opencode/context/openagents-repo/core-concepts/categories.md` → How organization works

**Guides** (Load for specific workflows):
- `.opencode/context/openagents-repo/guides/adding-agent-basics.md` → Step-by-step agent creation
- `.opencode/context/openagents-repo/guides/testing-agent.md` → Testing workflow
- `.opencode/context/openagents-repo/guides/updating-registry.md` → Registry workflow
- `.opencode/context/openagents-repo/guides/debugging.md` → Troubleshooting

**Lookup** (Quick reference):
- `.opencode/context/openagents-repo/lookup/file-locations.md` → Where everything is
- `.opencode/context/openagents-repo/lookup/commands.md` → Command reference

## Key Requirements

{Extract key requirements from loaded context}

**From Standards**:
- {requirement 1 from code.md}
- {requirement 2 from tests.md}
- {requirement 3 from docs.md}

**From Repository Context**:
- {requirement 1 from repo context}
- {requirement 2 from repo context}
- {requirement 3 from repo context}

**Naming Conventions**:
- {convention 1}
- {convention 2}

**File Structure**:
- {structure requirement 1}
- {structure requirement 2}

## Technical Constraints

{List technical constraints and limitations}
- {constraint 1 - e.g., "Must use TypeScript"}
- {constraint 2 - e.g., "Must follow category-based organization"}
- {constraint 3 - e.g., "Must include proper frontmatter metadata"}

## Files to Create/Modify

{List all files that need to be created or modified}

**Create**:
- `{file-path-1}` - {purpose and what it should contain}
- `{file-path-2}` - {purpose and what it should contain}

**Modify**:
- `{file-path-3}` - {what needs to be changed}
- `{file-path-4}` - {what needs to be changed}

## Success Criteria

{Define what "done" looks like - binary pass/fail conditions}
- [ ] {criteria 1 - e.g., "Agent file created with proper frontmatter"}
- [ ] {criteria 2 - e.g., "Eval tests pass"}
- [ ] {criteria 3 - e.g., "Registry validation passes"}
- [ ] {criteria 4 - e.g., "Documentation updated"}

## Validation Requirements

**Scripts**: `{script-1}` - {validates} | `{script-2}` - {validates}
**Tests**: `{test-1}` - {tests} | `{test-2}` - {tests}
**Manual**: {check 1} | {check 2}

## Expected Output

**Deliverables**: {deliverable 1} | {deliverable 2}
**Format**: {format 1} | {format 2}

## Progress Tracking
- [ ] Context loaded | [ ] {step 1} | [ ] {step 2} | [ ] {step 3} | [ ] Validation | [ ] Docs

---

## Instructions for Subagent

{Specific, detailed instructions for the subagent}

**IMPORTANT**: 
1. Load ALL context files listed in "Relevant Standards" and "Repository-Specific Context" sections BEFORE starting work
2. Follow ALL requirements from the loaded context
3. Apply naming conventions and file structure requirements
4. Validate your work using the validation requirements
5. Update progress tracking as you complete steps

**Your Task**: {Detailed description of what the subagent needs to do}

**Approach**: {Suggested approach or methodology}

**Constraints**: {Any additional constraints or notes}

**Questions/Clarifications**: {Any questions the subagent should consider or clarifications needed}
```

---

## Usage Instructions

### When to Create
- Delegating to any subagent
- Task requires coordination across multiple components
- Subagent needs project-specific context
- Task has complex requirements or constraints

### How to Create
1. `mkdir -p .tmp/context/{session-id}`
2. `cp .opencode/context/openagents-repo/templates/context-bundle-template.md .tmp/context/{session-id}/bundle.md`
3. Fill in all sections: Replace placeholders, list context files, define success criteria, provide instructions
4. Pass to subagent:
```javascript
task(subagent_type="{SubagentName}", description="Brief description",
     prompt="Load context from .tmp/context/{session-id}/bundle.md before starting.\n\n{Specific task instructions}\n\nFollow all standards and requirements in the context bundle.")
```

### Best Practices

**DO**: ✅ List context files with full paths | ✅ Extract key requirements | ✅ Define binary success criteria | ✅ Provide validation requirements | ✅ Include clear instructions

**DON'T**: ❌ Duplicate full context content | ❌ Use vague criteria | ❌ Skip validation | ❌ Forget technical constraints | ❌ Omit file paths

### Example Context Bundle

See `.opencode/context/openagents-repo/examples/context-bundle-example.md` for a complete example.

---

**Last Updated**: 2025-01-21  
**Version**: 1.0.0
