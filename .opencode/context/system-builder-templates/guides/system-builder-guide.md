<!-- Context: system-builder/guides | Priority: low | Version: 2.0 | Updated: 2026-07-14 -->
# System Builder Guide

**Core Idea**: `/build-context-system` creates a complete `.opencode/` agent architecture via interactive interview. Generates orchestrator + subagents + context files + workflows + commands. Follows research-backed patterns (Stanford/Anthropic) for optimal AI agent performance.

---

## Quick Start

```bash
/build-context-system
```

Launches interactive 5-phase interview: Domain → Use Cases → Complexity → Integration → Review.

## What You Get

```
.opencode/
├── agent/
│   ├── {domain}-orchestrator.md           # Main coordinator
│   └── subagents/
│       ├── {specialist-1}.md, {specialist-2}.md, ...
├── context/
│   ├── domain/       # Core knowledge
│   ├── processes/    # Workflows
│   ├── standards/    # Quality rules
│   └── templates/    # Reusable patterns
├── workflows/        # Step-by-step procedures
├── command/          # Slash commands
├── navigation.md     # System overview
├── ARCHITECTURE.md   # Architecture guide
├── TESTING.md        # Testing checklist
└── QUICK-START.md    # Usage examples
```

**Research-backed optimizations**: +20% routing accuracy (LLM-based), +25% consistency (XML structure), 80% context efficiency (3-level allocation), +17% overall performance.

---

## Interview Process

### Phase 1: Domain & Purpose (3 questions)
- **Q1**: Primary domain? (e-commerce, data engineering, healthcare, fintech, education, etc.)
- **Q2**: Primary purpose? (automate tasks, coordinate workflows, generate content, analyze data, support)
- **Q3**: Primary users? (developers, content creators, data analysts, support teams, product managers)

### Phase 2: Use Cases & Workflows (3 questions)
- **Q4**: Top 3-5 use cases. Be specific: "Process customer orders from multiple channels" not "Do stuff".
- **Q5**: Complexity per use case: **Simple** (single-step) / **Moderate** (multi-step with decisions) / **Complex** (multi-agent coordination)
- **Q6**: Dependencies between use cases? (sequential, parallel, or independent)

### Phase 3: Complexity & Scale (3 questions)
- **Q7**: How many specialized agents? 2-3 (simple) / 4-6 (moderate) / 7+ (complex)
- **Q8**: Knowledge types needed? Domain (core concepts) / Process (workflows) / Standards (quality) / Templates (formats)
- **Q9**: State requirements? **Stateless** (independent tasks) / **Project-based** (per-session) / **Full history** (learn from past)

### Phase 4: Integration & Tools (3 questions)
- **Q10**: External integrations? APIs (Stripe, Twilio), databases (PostgreSQL, Redis), cloud (AWS, GCP), dev tools (GitHub, Slack)
- **Q11**: File operations? Read-only / Read-write / Full management
- **Q12**: Custom slash commands? e.g., `/process-order {order_id}`, `/generate-report {type} {date}`

### Phase 5: Review & Confirmation
System presents complete architecture summary. Options: **Proceed** (generate) / **Revise** (adjust components) / **Cancel** (start over)

---

## System Architecture

### Hierarchical Agent Pattern
```
User Request → Main Orchestrator → [Analyze → Allocate Context → Route] → Subagent A / B / C
```

### 3-Level Context Allocation
| Level | Context Scope | Use Case | Overhead Reduction |
|-------|--------------|----------|-------------------|
| **1 (80%)** | Task description only | Simple, well-defined ops | 80% |
| **2 (20%)** | Task + relevant domain knowledge | Domain expertise needed | 60% |
| **3 (rare)** | Task + domain + historical state | Complex multi-step | Optimized for accuracy |

### Context Organization
- **domain/** → Core concepts, terminology, business rules, data models
- **processes/** → Standard workflows, integration patterns, edge cases, escalation paths
- **standards/** → Quality criteria, validation rules, compliance, error handling
- **templates/** → Output formats, common patterns, reusable structures

---

## Best Practices

| Area | Rule |
|------|------|
| **Agent design** | Single responsibility per agent. Stateless subagents (no conversation history). Complete instructions per call. |
| **Context files** | 50-200 lines per file. Descriptive names (`pricing-rules.md` not `rules.md`). No duplication. Include examples. |
| **Context efficiency** | Prefer Level 1 for 80% of tasks. Level 2 only when domain knowledge truly needed. |
| **Workflows** | Clear stages with purpose + prerequisites + checkpoints. Document dependencies. Plan error handling. |
| **Outputs** | Structured (YAML/JSON). Define exact format with examples. Validate at critical points. |

## Testing

1. Test orchestrator with simple request
2. Test each subagent independently
3. Verify context files load correctly
4. Test workflows end-to-end
5. Test custom commands
6. Validate error handling + edge cases

**Quality targets**: Agent 8+/10, Context Organization 8+/10, Workflow Completeness 8+/10, Docs 8+/10.

## Customization

After generation: Add domain-specific context, adjust workflows based on real usage, refine validation criteria, add examples to agent prompts, create additional slash commands.

## Example Systems

| Domain | Agents | Workflows | Commands |
|--------|--------|-----------|----------|
| **E-commerce** | order-processor, inventory-checker, payment-handler | simple-order, refund-process | `/process-order`, `/check-inventory` |
| **Data Pipeline** | data-extractor, transformation-engine, quality-validator | standard-etl, data-quality-check | `/run-pipeline`, `/validate-data` |
| **Content Creation** | research-assistant, content-generator, quality-validator | research-enhanced, multi-platform | `/create-content`, `/research-topic` |

## References

- Templates: `.opencode/context/system-builder-templates/templates/`
- Generated docs: `navigation.md`, `ARCHITECTURE.md`, `TESTING.md`, `QUICK-START.md`
