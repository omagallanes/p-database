<!-- Context: project-intelligence/development/guide-refactor | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Guide: Refactoring Large Components

**Core Idea**: Split 1k+ line components into orchestrator + extracted segments following a repeatable process.

## Step-by-Step

### 1. Identify JSX Sections
Scan the component JSX. Group related fields into logical sections:
- Basic Info (title, description, body)
- Metadata (type, status, language, favorite)
- Advanced (version, changelog, notes)
- Taxonomy (multi-select for categories, tags, platforms, etc.)

### 2. Extract Each Section
Create one file per section. Each file gets:
- Props interface with specific fields + individual onChange handlers
- Optional `errors?: Record<string, string | undefined>`
- Pure render (no state, no business logic)

### 3. Create Generic Reusable Components
If the same pattern repeats (e.g., 6 N:M multi-selects), create a generic component that accepts `items`, `selectedIds`, `onChange`.

### 4. Refactor Orchestrator
- Import all new segments
- Orchestrator keeps ALL state, business logic (submit, copy, delete, duplicate)
- Pass slices of state + onChange callbacks to each segment
- Verify compilation with `npx tsc --noEmit` after EACH extraction

### 5. Post-Split Checklist
- [ ] Each file < 150 lines
- [ ] No circular dependencies between extracted files
- [ ] All imports updated (2 types: external → `@/` → `./`)
- [ ] Build compiles (`npx tsc --noEmit`)
- [ ] Existing tests still pass (`npm test`)
- [ ] No unused imports/vars (`npm run lint`)

## Extraction Order (Dependencies First)
1. Helper/schema modules (no internal deps)
2. Modules that depend on helpers
3. Orchestrator last (imports all extracted modules)

**Example**: Fase 3 split `import/prompts/route.ts` (663 → 63 lns):
```
schemas.ts → upsert-entity.ts → import-v2.ts + import-v1.ts → route.ts
```

## Reference
- `docs/technical-development-knowledge/PCI-plan-c-completo.md` §3.2-3.3
- `components/prompt/PromptForm.tsx` → `BasicInfoSegment`, `MetadataSegment`, `AdvancedSegment`, `TaxonomyMultiSelect`
- `app/api/import/prompts/route.ts` → `schemas.ts`, `upsert-entity.ts`, `import-v2.ts`, `import-v1.ts`
