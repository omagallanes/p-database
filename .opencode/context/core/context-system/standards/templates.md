<!-- Context: core/templates | Priority: critical | Version: 1.0 | Updated: 2026-02-15 -->

# Context File Templates

**Purpose**: Standard formats for all context file types

**Last Updated**: 2026-01-06

---

## Template Selection Guide

| Type | Max Lines | Required Sections |
|------|-----------|-------------------|
| Concept | 100 | Purpose, Core Idea (1-3 sentences), Key Points (3-5), Example (<10 lines), Codebase Refs, Reference, Related |
| Example | 80 | Purpose, Use Case, Code (10-30 lines), Explanation, Codebase Refs, Related |
| Guide | 150 | Purpose, Prerequisites, Steps (4-7), Verification, Troubleshooting, Codebase Refs, Related |
| Lookup | 100 | Purpose, Tables/Lists, Commands, Paths, Codebase Refs, Related |
| Error | 150 | Purpose, Per-error entries (Symptom, Cause, Solution, Code, Prevention), Codebase Refs, Related |
| Navigation | 100 | Purpose, ASCII Structure, Quick Routes table, By Concern/Type, Related Context |
| Specialized | 80 | Scope, Structure, Quick Routes, By Framework/Approach, Workflows |

---

## 1. Concept Template

```markdown
<!-- Context: {cat}/concepts | Priority: C|H|M|L | Version: 1.0 | Updated: YYYY-MM-DD -->
# Concept: {Name}
**Purpose**: [1 sentence] | **Last Updated**: {YYYY-MM-DD}

## Core Idea — [1-3 sentences]
## Key Points — Point 1 · Point 2 · Point 3
## When to Use — Use case 1 · Use case 2
## Quick Example — ```lang [<10 lines] ```
## 📂 Codebase Refs: Business `path/rules.ts` · Impl `path/main.ts` · Tests `path/test.ts`
## Deep Dive — **Reference**: [Link]
## Related — concepts/x.md · examples/y.md
```

---

## 2. Example Template

```markdown
<!-- Context: {cat}/examples | Priority: H|M | Version: 1.0 | Updated: YYYY-MM-DD -->
# Example: {What It Shows}
**Purpose**: [1 sentence] | **Last Updated**: {YYYY-MM-DD}

## Use Case — [2-3 sentences]
## Code — ```lang [10-30 lines] ```
## Explanation — 1. Step 1  2. Step 2  3. Step 3
**Key points**: Detail 1 · Detail 2
## 📂 Codebase Refs: Impl `path/real-impl.ts` · Helper `path/helper.ts` · Tests `path/test.ts`
## Related — concepts/x.md
```

---

## 3. Guide Template

```markdown
<!-- Context: {cat}/guides | Priority: C|H|M | Version: 1.0 | Updated: YYYY-MM-DD -->
# Guide: {Action}
**Purpose**: [1 sentence] | **Last Updated**: {YYYY-MM-DD}

## Prerequisites — Req 1 · Req 2 · **Est. time**: X min

## Steps
### 1. {Step} — ````bash {command} ```` — **Expected**: [result] · **Impl**: `path/to/step.ts`
### 2-7. [Repeat remaining steps]

## Verification — ````bash {verify command} ````
## 📂 Codebase Refs: Workflow `path/workflow.ts` · BizLogic `path/rules.ts` · Tests `path/test.ts`
## Troubleshooting — | Issue | Solution | |---|---| | Problem | Fix |
## Related — concepts/x.md
```

---

## 4. Lookup Template

```markdown
<!-- Context: {cat}/lookup | Priority: H|M | Version: 1.0 | Updated: YYYY-MM-DD -->
# Lookup: {Type}
**Purpose**: Quick reference for {desc} | **Last Updated**: {YYYY-MM-DD}

## {Section} Table — | Item | Value | Desc | Code | |---|---|---|---| | x | y | z | `path` |
## Commands — ````bash # Description  {command} ````
## Paths — `{path}` - {desc}
## 📂 Codebase Refs: Validation `path/validator.ts` · Config `path/config.ts` · Tests `path/test.ts`
## Related — concepts/x.md
```

---

## 5. Error Template

```markdown
<!-- Context: {cat}/errors | Priority: H|M | Version: 1.0 | Updated: YYYY-MM-DD -->
# Errors: {Framework}
**Purpose**: Common errors for {framework} | **Last Updated**: {YYYY-MM-DD}

## Error: {Name}
**Symptom**: ``` {msg} ``` **Cause**: [1-2 sentences]
**Solution**: 1. Step 1  2. Step 2
**Code**: ```lang  // ❌ Bad  // ✅ Fixed ```
**Prevention**: [how to avoid] · **Frequency**: common/occasional/rare
**Code Refs**: Thrown `path/src.ts` · Handler `path/handler.ts` · Prevention `path/validator.ts`
---
[Repeat for 5-10 errors per file]
## 📂 Codebase Refs: Defs `path/error-types.ts` · Handler `path/handler.ts` · Tests `path/test.ts`
## Related — concepts/x.md
```

---

## 6. Navigation Template (README Replacement)

Use `navigation.md` instead of `README.md`. **Target**: 200-300 tokens

```markdown
# {Category} Navigation
**Purpose**: [1 sentence]

## Structure
```
{category}/ ├── navigation.md └── {subcategory}/{files}.md
```
## Quick Routes
| Task | Path |
|------|------|
| **{Task 1}** | `{path}` | **{Task 2}** | `{path}` |
## By {Concern/Type}
**{Section}** → {description} | **{Section}** → {description}
## Related — **{Category}** → `../{category}/navigation.md`
```

---

## 7. Specialized Navigation Template

For cross-cutting concerns (e.g., `ui-navigation.md`). **Target**: 250-300 tokens

```markdown
# {Domain} Navigation
**Scope**: [What this covers]

## Structure
```
{Relevant directories across multiple categories}
```
## Quick Routes — | Task | Path | |---|---| | **{Task}** | `{path}` |
## By {Framework} — **{Tech}** → `{path}` | **{Tech}** → `{path}`
## Common Workflows — **{Workflow}**: 1. `{file}` (purpose) 2. `{file}` (purpose)
```

---

## All Templates Must Have

1. Title with type prefix (`# Concept:`, `# Example:`, etc.)
2. **Purpose** (1 sentence) | 3. **Last Updated** (YYYY-MM-DD) | 4. **Related** (cross-references)

---

## Validation Checklist

- [ ] Correct template for file type?
- [ ] Has all required sections?
- [ ] Under max line limit?
- [ ] Cross-references added?
- [ ] Added to navigation.md?

---

## Related

- `creation.md` — When to use each template
- `mvi-principle.md` — How to fill templates
- `compact.md` — How to stay under limits
