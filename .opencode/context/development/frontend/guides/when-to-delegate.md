<!-- Context: development/frontend/when-to-delegate | Priority: high | Version: 1.0 | Updated: 2026-01-30 -->
# When to Delegate to Frontend Specialist

## Overview

Clear decision criteria for when to delegate frontend/UI work to the **frontend-specialist** subagent vs. handling it directly.

## Quick Reference

**Delegate to frontend-specialist when**: UI/UX design work, design system implementation, complex responsive layouts, animation and micro-interactions, visual design iterations

**Handle directly when**: Simple HTML/CSS edits, single component updates, bug fixes in existing UI, minor styling tweaks

---

## Decision Matrix

### ✅ DELEGATE to Frontend-Specialist

| Scenario | Why Delegate | Example |
|----------|--------------|---------|
| **New UI design from scratch** | Needs staged workflow | "Create a landing page for our product" |
| **Design system work** | Needs ContextScout + ExternalScout | "Implement Tailwind + Shadcn design system" |
| **Complex responsive layouts** | Mobile-first across breakpoints | "Dashboard with sidebar, cards, responsive grid" |
| **Animation implementation** | Animation patterns, perf optimization | "Add smooth transitions and micro-interactions" |
| **Multi-stage iterations** | Versioning (design_iterations/ folder) | "Design a 3-step checkout flow" |
| **Theme creation** | OKLCH colors, CSS custom properties | "Create dark mode theme" |
| **Component lib integration** | ExternalScout for current docs | "Integrate Flowbite components" |
| **Accessibility-focused UI** | WCAG compliance, ARIA attributes | "Accessible form with validation" |

### ⚠️ HANDLE DIRECTLY

| Scenario | Why Direct | Example |
|----------|------------|---------|
| **Simple HTML edits** | Single file change | "Change 'Submit' to 'Send'" |
| **Minor CSS tweaks** | Small adjustment | "Header padding 20px instead of 16px" |
| **Bug fixes** | Fixing existing code | "Fix broken footer link" |
| **Content updates** | Changing text/images | "Update hero section copy" |
| **Single component updates** | One component change | "Add new prop to Button component" |
| **Quick prototypes** | Throwaway code | "Quick HTML mockup to test an idea" |

---

## Delegation Checklist

Before delegating, ensure:
- [ ] Task is UI/design focused (not backend/data)
- [ ] Task requires design expertise (layout, theme, animations)
- [ ] Benefits from staged workflow (layout → theme → animation → implement)
- [ ] Needs context discovery (design systems, UI libraries)
- [ ] User has approved the approach (never delegate before approval)

---

## How to Delegate

### Step 1: Discover Context (Optional but Recommended)
```javascript
task(subagent_type="ContextScout", description="Find frontend design context",
  prompt="Find design system standards, UI component patterns, animation guidelines,
  and responsive breakpoint conventions for frontend work.")
```

### Step 2: Propose Approach
Present a plan to the user explaining why delegation is appropriate, what context files are needed, and what the workflow will look like. Wait for explicit approval.

### Step 3: Get Approval
Never delegate without user approval. The user must explicitly confirm they want the frontend-specialist to handle the task.

### Step 4: Delegate with Context
For simple delegation (no session needed):
```javascript
task(subagent_type="frontend-specialist", description="Create landing page design",
  prompt="Context to load:
  - .opencode/context/ui/web/concepts/design-systems.md
  - .opencode/context/ui/web/concepts/ui-styling.md
  - .opencode/context/ui/web/concepts/animation-basics.md

  Task: Create a landing page with:
  - Hero section with headline, subheadline, CTA button
  - Features grid (3 columns on desktop, 1 on mobile)
  - Smooth scroll animations

  Requirements:
  - Use Tailwind CSS + Flowbite
  - Mobile-first responsive design
  - Animations <400ms
  - Save to design_iterations/landing_1.html

  Follow staged workflow: Layout → Theme → Animation → Implement.
  Request approval between each stage.")
```

For complex delegation (with session), create session context first then delegate with session path.

**Implementation Plan Template**:
```markdown
## Implementation Plan
**Task**: Create landing page with hero, features grid, and CTA
**Approach**: Delegate to frontend-specialist subagent
**Why**: Requires design system implementation, responsive layout, animations
**Context Needed**: design-systems.md, ui-styling.md, animation-basics.md
**Approval needed before proceeding.**
```

---

## Common Patterns

| Pattern | Trigger | Decision |
|---------|---------|----------|
| **New Landing Page** | User wants a new page | ✅ Delegate |
| **Design System** | Implement/update design system | ✅ Delegate |
| **Animation Work** | Animations, transitions, micro-interactions | ✅ Delegate |
| **Component Library** | Integrate Flowbite, Radix, etc. | ✅ Delegate |
| **Simple HTML Edit** | Change text, fix link, update content | ⚠️ Direct |
| **CSS Bug Fix** | Styling bug or broken layout | ⚠️ Direct |

---

## Red Flags & Green Flags

**Don't Delegate**: Quick fixes, backend/logic, single line changes, content updates, testing, code review
**Delegate**: New UI designs, design systems, responsive layouts, animations, UI lib integration, staged workflows

---

## Frontend-Specialist Capabilities

**Does well**: Complete UI designs from scratch, design systems (Tailwind, Shadcn, Flowbite), responsive layouts (mobile-first), animations/micro-interactions, UI library integration, themes with OKLCH colors, staged workflow, versioning (design_iterations/ folder)

**Doesn't do**: Backend logic/API integration, database queries/data processing, testing/validation, code review/refactoring, simple HTML/CSS edits (overkill), content updates (just text changes)

---

## Context Files (Auto-loaded via ContextScout)

- `ui/web/concepts/design-systems.md` — Theme templates, color systems
- `ui/web/concepts/ui-styling.md` — Tailwind, Flowbite, responsive design
- `ui/web/examples/animation-components.md` — Animation examples (images, icons, fonts)
- `ui/web/concepts/animation-basics.md` — Animation syntax, micro-interactions
- `ui/web/concepts/react-patterns.md` — React patterns
- `core/workflows/design-iteration-overview.md` — Design iteration workflow

---

## Best Practices

**Do's**: Propose before delegating, get approval, provide context files, set clear requirements, use staged workflow, trust the specialist's workflow
**Don'ts**: Delegate simple edits, skip approval, delegate backend work, micromanage, delegate without context, delegate bug fixes

---

## Detailed Examples

### Example 1: Landing Page (Delegate)
**User Request**: "Create a landing page for our SaaS product with hero, features, and pricing"
**Your Plan**: Propose delegation → Get approval → Delegate with context files
**Why**: Requires full design workflow, responsive across breakpoints, benefits from design system standards

### Example 2: Button Text Change (Direct)
**User Request**: "Change 'Submit' button to say 'Send Message'"
**Action**: Read HTML file, edit button text directly. No delegation needed.

### Example 3: Design System (Delegate)
**User Request**: "Implement design system with Tailwind + Shadcn components"
**Action**: Call ExternalScout for current Shadcn docs → Propose plan → Delegate
**Why**: Needs UI library integration, ExternalScout for live docs, design system standards

---

## Summary

**Delegate**: New UI designs, design systems, responsive layouts, animations, UI library integration, multi-stage iterations
**Handle directly**: Simple HTML/CSS edits, bug fixes, content updates, single component updates, quick prototypes
**Always**: Propose first, get approval, provide context, trust the specialist's workflow

---

## Related Context

- **Frontend Specialist Agent** → `../../../agent/subagents/development/frontend-specialist.md`
- **Design Systems** → `../../ui/web/concepts/design-systems.md`
- **UI Styling Standards** → `../../ui/web/concepts/ui-styling.md`
- **Animation Patterns** → `../../ui/web/concepts/animation-basics.md`
- **Delegation Workflow** → `../../core/workflows/task-delegation-basics.md`
- **React Patterns** → `../../ui/web/concepts/react-patterns.md`