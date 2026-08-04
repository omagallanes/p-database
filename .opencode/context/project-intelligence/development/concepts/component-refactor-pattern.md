<!-- Context: project-intelligence/development/component-refactor | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Concept: Component Refactor Pattern (Extract Segments)

**Core Idea**: Split large components (1k+ lines) into an orchestrator + extracted segments by functionality. Orchestrator keeps all state and business logic; segments receive typed props + onChange handlers.

**Key Points**:
- Identify JSX sections by related fields (Basic Info, Metadata, Advanced, Taxonomy)
- Each segment gets its own Props interface with individual onChange per field + optional `errors` record
- Orchestrator maintains all state and handles submit, duplicate, copy, delete
- Generic reusable components (e.g., `TaxonomyMultiSelect`) for repeated patterns (6 taxonomies N:M)
- Verify compilation after EACH extraction with `npx tsc --noEmit`

**Extraction Order**:
1. Extract modules without dependencies first (schemas, helpers)
2. Extract modules that depend on those
3. Finally refactor the orchestrator (route.ts or main component)

**Reference**: `docs/technical-development-knowledge/PCI-plan-c-completo.md` (Fase 2 + Fase 3)

**Related**:
- examples/segment-component.md
- guides/refactor-large-components.md
