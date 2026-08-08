<!-- Context: openagents-repo/examples | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Context Bundle Example: Create Data Analyst Agent

Session: 20250121-143022-a4f2 | Created: 2025-01-21T14:30:22Z | For: TaskManager | Status: in_progress

## Task Overview

Create a new data analyst agent for the OpenAgents Control repository. This agent will specialize in data analysis tasks including data visualization, statistical analysis, and data transformation.

## User Request

"Create a new data analyst agent that can help with data analysis, visualization, and statistical tasks"

## Relevant Standards (Load These Before Starting)

**Core Standards**:
- `.opencode/context/core/standards/code-quality.md` → Modular, functional code patterns
- `.opencode/context/core/standards/test-coverage.md` → Testing requirements and TDD
- `.opencode/context/core/standards/documentation.md` → Documentation standards

**Core Workflows**:
- `.opencode/context/core/workflows/feature-breakdown.md` → Task breakdown methodology

## Repository-Specific Context (Load Before Starting)

**Quick Start** (ALWAYS load first):
- `.opencode/context/openagents-repo/quick-start.md` → Repo orientation and common commands

**Core Concepts**:
- `.opencode/context/openagents-repo/core-concepts/agents.md` → How agents work
- `.opencode/context/openagents-repo/core-concepts/evals.md` → How testing works
- `.opencode/context/openagents-repo/core-concepts/registry.md` → How registry works
- `.opencode/context/openagents-repo/core-concepts/categories.md` → How organization works

**Guides**:
- `.opencode/context/openagents-repo/guides/adding-agent-basics.md` → Step-by-step agent creation
- `.opencode/context/openagents-repo/guides/testing-agent.md` → Testing workflow
- `.opencode/context/openagents-repo/guides/updating-registry.md` → Registry workflow

## Key Requirements

**From Standards**:
- Agent must follow modular, functional programming patterns
- All code must be testable and maintainable
- Documentation must be concise and high-signal
- Include examples where helpful

**From Repository Context**:
- Agent file in `.opencode/agent/data/` directory
- Must include proper frontmatter metadata
- Naming: `data-analyst.md` (kebab-case)
- Must include tags for discoverability
- Must specify tools and permissions
- Must be registered in `registry.json`

**Naming Conventions**:
- File: `data-analyst.md` | ID: `data-analyst` | Category: `data` | Type: `agent`

**File Structure**:
- Agent file: `.opencode/agent/data/data-analyst.md`
- Eval config: `evals/agents/data/data-analyst/config/eval-config.yaml`
- Eval tests: `evals/agents/data/data-analyst/tests/`
- README: `evals/agents/data/data-analyst/README.md`

## Technical Constraints

- Must use category-based organization (data category)
- Must include proper frontmatter metadata
- Must specify tools (read, write, bash for data tasks)
- Must define permissions for sensitive operations
- Temperature setting: 0.1-0.3 for analytical tasks
- Agent prompt structure: context → role → task → instructions
- Eval tests must use YAML format
- Registry entry must follow schema

## Files to Create/Modify

**Create**:
- `.opencode/agent/data/data-analyst.md` - Main agent definition with frontmatter and prompt
- `evals/agents/data/data-analyst/config/eval-config.yaml` - Eval configuration
- `evals/agents/data/data-analyst/tests/smoke-test.yaml` - Basic smoke test
- `evals/agents/data/data-analyst/tests/data-analysis-test.yaml` - Data analysis capability test
- `evals/agents/data/data-analyst/README.md` - Agent documentation

**Modify**:
- `registry.json` - Add data-analyst agent entry
- `.opencode/context/navigation.md` - Add data category context if needed

## Agent Prompt Structure (Expected)

The agent prompt should follow this pattern:
- **Context section**: System context (OpenAgents Control), domain context (data analysis), task context (agent creation), execution context (tools available)
- **Role definition**: "You are a Data Analyst Agent specializing in data analysis, visualization, and statistical tasks"
- **Task description**: What the agent does, when to use it, its capabilities
- **Instructions and workflow**: Step-by-step guidance on how to handle data analysis requests
- **Tools and capabilities**: What tools the agent can use (read, write, bash) and what capabilities it has
- **Examples**: If helpful, include usage examples

## Success Criteria

- [x] Agent file created with proper frontmatter metadata
- [x] Agent prompt follows established patterns
- [x] Eval test structure created with config and tests
- [x] Smoke test passes
- [x] Data analysis test passes
- [x] Registry entry added and validates
- [x] README documentation created
- [x] All validation scripts pass

## Validation Requirements

**Scripts to Run**:
- `./scripts/registry/validate-registry.sh` - Validates registry.json schema
- `./scripts/validation/validate-test-suites.sh` - Validates eval test structure

**Tests to Run**:
- `cd evals/framework && npm run eval:sdk -- --agent=data/data-analyst --pattern="smoke-test.yaml"`
- `cd evals/framework && npm run eval:sdk -- --agent=data/data-analyst`

**Manual Checks**:
- Verify frontmatter includes all required fields
- Check that tools and permissions are appropriate
- Ensure prompt is clear and follows standards

## Expected Output

**Deliverables**: Functional data analyst agent | Complete eval test suite | Registry entry | Documentation
**Format**: Agent: Markdown + YAML frontmatter | Eval: YAML | README: Markdown

## Progress Tracking

- [x] Context loaded and understood
- [x] Agent file created with frontmatter
- [x] Agent prompt written
- [x] Eval directory structure created
- [x] Eval config created
- [x] Smoke test created
- [x] Data analysis test created
- [x] README documentation created
- [x] Registry entry added
- [x] Validation scripts run / All tests pass

---

## Instructions for Subagent

**IMPORTANT**:
1. Load ALL context files before starting work
2. Follow ALL requirements from the loaded context
3. Apply naming conventions and file structure requirements
4. Validate work using the validation requirements
5. Update progress tracking as you complete steps

**Your Task**: Create a complete data analyst agent following all established conventions and standards.

**Approach**:
1. **Load Context**: Read agents.md to understand agent structure, adding-agent-basics.md for creation workflow, code-quality.md for coding standards, evals.md for testing requirements
2. **Create Agent File**: `.opencode/agent/data/data-analyst.md` with complete frontmatter (description, category, type, mode, tools, permission, temperature) and well-structured prompt (context section, role definition, task description, instructions and workflow, tools and capabilities)
3. **Create Eval Structure**: `evals/agents/data/data-analyst/` with config (`eval-config.yaml`), smoke test (`smoke-test.yaml`), and capability test (`data-analysis-test.yaml`)
4. **Update Registry**: Add entry to registry.json following schema (id, name, description, category, type, path, version, tags)
5. **Validate**: Run validation scripts + eval tests, fix any issues

**Constraints**:
- Agent must be in `data` category
- Must follow functional programming patterns
- Must include proper error handling
- Must specify appropriate tools (read, write, bash for data tasks)
- Temperature should be 0.1-0.3 for analytical precision
- Eval tests must be meaningful and test actual capabilities

**Questions/Clarifications**:
- What specific data analysis capabilities should be emphasized? (visualization, statistics, transformation)
- Should the agent support specific data formats? (CSV, JSON, Parquet)
- Should the agent integrate with specific tools? (pandas, matplotlib, etc.)
- What level of statistical analysis? (descriptive, inferential, predictive)

## References

- Context bundle template: `.opencode/context/openagents-repo/templates/context-bundle-template.md`

**Note**: This is an example context bundle for illustration purposes.
