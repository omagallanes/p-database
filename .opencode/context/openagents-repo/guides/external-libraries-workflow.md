<!-- Context: openagents-repo/guides/external-libraries-workflow | Priority: high | Version: 1.0 | Updated: 2026-01-29 -->
# Guide: External Libraries Workflow

**Purpose**: Fetch current documentation for external packages when adding agents or skills  
**When to Use**: Any time you're working with external libraries (Drizzle, Better Auth, Next.js, etc.)

---

## Quick Start

**Golden Rule**: NEVER rely on training data for external libraries → ALWAYS fetch current docs

**Process**:
1. Detect external package in your task
2. Check for install scripts (if first-time setup)
3. Use **ExternalScout** to fetch current documentation
4. Implement with fresh, version-specific knowledge

---

## When to Use ExternalScout (MANDATORY)

✅ **Use ExternalScout when**: Adding agents that depend on external packages | Adding skills integrating with external libraries | First-time package setup | Package/dependency errors | Version upgrades | ANY external library work

❌ **Don't rely on**: Training data (outdated, often wrong) | Old documentation (APIs change) | Assumptions about package behavior

---

## Why This Matters

**Example**: Next.js Evolution
```
Training data (2023): Next.js 13 uses pages/ directory
Current (2025): Next.js 15 uses app/ directory (App Router)
Training data = broken code ❌ | ExternalScout = working code ✅
```

**Real Impact**: APIs change (new methods, deprecated features) | Configuration patterns evolve | Breaking changes happen frequently | Version-specific features differ

---

## Workflow Steps

### Step 1: Detect External Package

**Triggers**: User mentions a library name | You see imports in code | package.json has new dependencies | Build errors reference external packages

**Action**: Identify which external packages are involved

**Example**: User: "Add authentication with Better Auth" → External package detected: Better Auth → Proceed to Step 2

### Step 2: Check Install Scripts (First-Time Only)

For first-time package setup, check if there are install scripts:

```bash
ls scripts/install/ scripts/setup/ bin/install* setup.sh install.sh
grep -r "postinstall\|preinstall" package.json
```

**Why**: Scripts may set up databases, generate config files, install system deps, or configure services in a specific order.

**If scripts exist**: Read them to understand setup order, check for env vars needed, identify prerequisites (database, services).

### Step 3: Fetch Current Documentation (MANDATORY)

Use ExternalScout to get live, version-specific documentation:

```javascript
task(
  subagent_type="ExternalScout",
  description="Fetch Drizzle ORM documentation",
  prompt="Fetch current documentation for Drizzle ORM focusing on:
          - Modular schema patterns
          - Next.js integration
          - Database setup
          - Migration strategies"
)
```

**What ExternalScout Returns**:
- Live documentation from official sources (not cached/training data)
- Version-specific features and APIs
- Integration patterns and best practices
- Setup requirements and prerequisites
- Code examples you can reference in implementation

**Supported Libraries** (18+):
Drizzle ORM | Better Auth | Next.js | TanStack Query/Router/Start | Cloudflare Workers | AWS Lambda | Vercel | Shadcn/ui | Radix UI | Tailwind CSS | Zustand | Jotai | Zod | React Hook Form | Vitest | Playwright | And more

### Step 4: Implement with Fresh Knowledge

Now implement using the documentation from ExternalScout:
- Follow current best practices and recommended patterns
- Use version-specific APIs (not deprecated ones from training data)
- Apply the integration patterns from the documentation
- Reference the fetched docs in your code comments for traceability
- Test the implementation to verify it works with the current library version

---

## Handling Documentation Results

After ExternalScout returns documentation:
1. **Read the fetched docs** carefully - note version numbers, API signatures, and configuration requirements
2. **Identify breaking changes** compared to any existing code that might use older versions
3. **Store key snippets** as reference comments in your implementation code
4. **Document version requirements** in package.json and component metadata
5. **Create or update installation scripts** if the package requires specific setup steps

Fetched docs are cached in `.opencode/external-context/{package-name}/`. Docs >7 days old are auto-refreshed.

---

## Integration with Agent/Skill Creation

### When Adding an Agent

1. Read: `guides/adding-agent-basics.md` to understand agent creation workflow
2. If agent uses external packages: Use ExternalScout to fetch current docs, document package dependencies in agent metadata (frontmatter), add to registry with correct versions
3. Test: `guides/testing-agent.md` to verify implementation

### When Adding a Skill

1. Read: `guides/adding-skill.md` to understand skill creation workflow
2. If skill uses external packages: Use ExternalScout to fetch current docs, document package dependencies in skill metadata, add to registry with correct versions
3. Test: `guides/testing-subagents.md` to verify skill functionality

---

## Common Packages in OpenAgents

| Package | Use Case | Priority |
|---------|----------|----------|
| **Drizzle ORM** | Database schemas & queries | ⭐⭐⭐⭐⭐ |
| **Better Auth** | Authentication & authorization | ⭐⭐⭐⭐⭐ |
| **Next.js** | Full-stack web framework | ⭐⭐⭐⭐⭐ |
| **TanStack Query** | Server state management | ⭐⭐⭐⭐ |
| **Zod** | Schema validation | ⭐⭐⭐⭐ |
| **Tailwind CSS** | Styling | ⭐⭐⭐⭐ |
| **Shadcn/ui** | UI components | ⭐⭐⭐ |
| **Vitest** | Testing framework | ⭐⭐⭐ |

---

## Documentation Cache

ExternalScout caches fetched documentation in `.opencode/external-context/{package-name}/`. Docs older than 7 days are automatically re-fetched. You can also manually trigger a refresh for a specific package.

---

## Checklist

Before implementing with external libraries:
- [ ] Identified all external packages involved
- [ ] Checked for install scripts (if first-time)
- [ ] Used ExternalScout to fetch current docs
- [ ] Reviewed version-specific features
- [ ] Documented dependencies in metadata
- [ ] Added to registry with correct versions
- [ ] Tested implementation thoroughly
- [ ] Referenced ExternalScout docs in code comments

---

## Related Guides

- `guides/adding-agent-basics.md` - Creating new agents
- `guides/adding-skill.md` - Creating new skills
- `guides/debugging.md` - Troubleshooting
- `guides/updating-registry.md` - Registry management

---

## Dependencies: External libraries are documented in agent metadata (not in the frontmatter dependencies array, which is for internal components). For skill dependencies, reference ExternalScout docs in metadata.

---

## Key Principle

> **External libraries change constantly. Your training data is outdated. Always fetch current documentation before implementing.**

This is not optional - it's the difference between working code and broken code.
