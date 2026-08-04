<!-- Context: openagents-repo/lookup | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Lookup: File Locations

**Purpose**: Quick reference for finding files

---

## Directory Tree

```
opencode-agents/
├── .opencode/
│   ├── agent/
│   │   ├── core/                    # Core system agents
│   │   ├── development/             # Dev specialists
│   │   ├── content/                 # Content creators
│   │   ├── data/                    # Data analysts
│   │   ├── product/                 # Product managers (ready)
│   │   ├── learning/                # Educators (ready)
│   │   └── subagents/               # Delegated specialists
│   │       ├── code/                # Code-related
│   │       ├── core/                # Core workflows
│   │       ├── system-builder/      # System generation
│   │       └── utils/               # Utilities
│   ├── command/                     # Slash commands
│   ├── context/                     # Shared knowledge
│   │   ├── core/                    # Core standards & workflows
│   │   ├── development/             # Dev context
│   │   ├── content-creation/        # Content creation context
│   │   ├── data/                    # Data context
│   │   ├── product/                 # Product context
│   │   ├── learning/                # Learning context
│   │   └── openagents-repo/         # Repo-specific context
│   ├── prompts/                     # Model-specific variants
│   ├── tool/                        # Custom tools
│   └── plugin/                      # Plugins
├── evals/
│   ├── framework/                   # Eval framework (TypeScript)
│   │   ├── src/                     # Source code
│   │   ├── scripts/                 # Test utilities
│   │   └── docs/                    # Framework docs
│   └── agents/                      # Agent test suites
│       ├── core/                    # Core agent tests
│       ├── development/             # Dev agent tests
│       └── content/                 # Content agent tests
├── scripts/
│   ├── registry/                    # Registry management
│   ├── validation/                  # Validation tools
│   ├── testing/                     # Test utilities
│   ├── versioning/                  # Version management
│   ├── docs/                        # Doc tools
│   └── maintenance/                 # Maintenance
├── docs/                            # Documentation
├── registry.json                    # Component catalog
├── install.sh                       # Installer
├── VERSION                          # Current version
└── package.json                     # Node dependencies
```

---

## Where Is...?

| Component | Location |
|-----------|----------|
| Core agents | `.opencode/agent/core/` |
| Category agents | `.opencode/agent/{category}/` |
| Subagents | `.opencode/agent/subagents/` |
| Commands | `.opencode/command/` |
| Context files | `.opencode/context/` |
| Prompt variants | `.opencode/prompts/{category}/{agent}/` |
| Tools | `.opencode/tool/` |
| Plugins | `.opencode/plugin/` |
| Agent tests | `evals/agents/{category}/{agent}/` |
| Eval framework | `evals/framework/src/` |
| Registry scripts | `scripts/registry/` |
| Validation scripts | `scripts/validation/` |
| Registry | `registry.json` |
| Installer | `install.sh` |
| Version | `VERSION` |

---

## Where Do I Add...?

| What | Where |
|------|-------|
| New core agent | `.opencode/agent/core/{name}.md` |
| New category agent | `.opencode/agent/{category}/{name}.md` |
| New subagent | `.opencode/agent/subagents/{category}/{name}.md` |
| New command | `.opencode/command/{name}.md` |
| New context | `.opencode/context/{category}/{name}.md` |
| Agent tests | `evals/agents/{category}/{agent}/tests/` |
| Test config | `evals/agents/{category}/{agent}/config/config.yaml` |

---

## Key File Paths

**Core**: `registry.json` | `install.sh` | `update.sh` | `VERSION` | `package.json` | `CHANGELOG.md`
**Core Agents**: `.opencode/agent/core/openagent.md` | `opencoder.md`
**Dev Agents**: `.opencode/agent/subagents/development/frontend-specialist.md` | `devops-specialist.md`
**Content**: `.opencode/agent/content/copywriter.md` | `technical-writer.md`
**Subagents**: `subagents/code/test-engineer.md` | `reviewer.md` | `coder-agent.md` | `core/task-manager.md`
**Core Context**: `context/core/standards/code-quality.md` | `documentation.md` | `test-coverage.md` | `security-patterns.md`
**Scripts**: `scripts/registry/validate-registry.sh` | `auto-detect-components.sh` | `validate-component.sh`
**Eval Framework**: `evals/framework/src/sdk/` | `evaluators/` | `collector/` | `types/`

---

## Where Is the Registry?

The registry (`registry.json`) is the central catalog. Related files:
- Registry management scripts: `scripts/registry/`
- Validation scripts: `scripts/validation/`
- Component metadata: `.opencode/config/agent-metadata.json`
- Agent files: `.opencode/agent/`
- Context files: `.opencode/context/`

## Where Are Eval Tests?

- Eval framework source: `evals/framework/src/`
- Agent test suites: `evals/agents/{category}/{agent-name}/`
- Test config: `evals/agents/{category}/{agent-name}/config/config.yaml`
- Test definitions: `evals/agents/{category}/{agent-name}/tests/*.yaml`
- Session data: `.tmp/sessions/{session-id}/`

## Path Patterns

**Agents**: `.opencode/agent/{category}/{agent-name}.md`
**Context**: `.opencode/context/{category}/{topic}.md`
**Tests**: `evals/agents/{category}/{agent-name}/config/config.yaml` + `tests/{test-name}.yaml`
**Scripts**: `scripts/{purpose}/{action}-{target}.sh`

---

## Naming Conventions

**Files**: Agents: `{name}.md` or `{domain}-specialist.md` | Context: `{topic}.md` | Tests: `{test-name}.yaml` | Scripts: `{action}-{target}.sh`
**Directories**: Categories: lowercase, singular (e.g., `development`) | Purposes: lowercase, descriptive (e.g., `registry`)

---

## Quick Lookups

```bash
# Find agent
find .opencode/agent -name "{agent-name}.md"

# Find tests
find evals/agents -name "*.yaml"

# Find context
find .opencode/context -name "*.md"

# Find scripts
find scripts -name "*.sh"
```

---

## File Organization Principles

- Categories match across agents, context, and tests (e.g., `core/` exists in agent/, context/, and evals/)
- Each category has a `0-category.json` metadata file
- Subagents live under `subagents/{subcategory}/` not directly under a category
- Context files use hyphens for multi-word names (`code-quality.md`)
- Scripts follow `{action}-{target}.sh` pattern for discoverability
- Tests mirror the agent directory structure exactly

---

## Related Files

- **Quick start**: `quick-start.md`
- **Categories**: `core-concepts/categories.md`
- **Commands**: `lookup/commands.md`

---

**Last Updated**: 2025-12-10  
**Version**: 0.5.0
