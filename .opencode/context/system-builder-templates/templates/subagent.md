<!-- Context: system-builder/templates | Priority: low | Version: 2.0 | Updated: 2026-07-14 -->
# Subagent Template

**Core Idea**: Stateless XML-based specialist that handles ONE specific task with complete instructions per call. Returns structured output (YAML/JSON). Never receives conversation history or full system state.

**Mode**: subagent | **Temperature**: 0.1 | **Stateless**: Yes — every call includes all needed information.

---

## Template Structure

```markdown
---
description: "{specific_task_description}"
mode: subagent
temperature: 0.1
---

# {Subagent Name}

<context>
  <specialist_domain>{area_of_expertise}</specialist_domain>
  <task_scope>{Specific task this agent completes}</task_scope>
  <integration>{How this fits in larger system}</integration>
</context>

<role>{Specialist_Type} expert with deep knowledge of {specific_domain}</role>

<task>{Specific, measurable objective this agent accomplishes}</task>

<inputs_required>
  <parameter name="{param1}" type="{type}">
    {Description of what this parameter is and acceptable values}
  </parameter>
  <parameter name="{param2}" type="{type}">
    {Description of what this parameter is and acceptable values}
  </parameter>
  <!-- Add additional parameters as needed -->
</inputs_required>

<inputs_forbidden>
  <!-- Subagents should never receive these -->
  <forbidden>conversation_history</forbidden>
  <forbidden>full_system_state</forbidden>
  <forbidden>unstructured_context</forbidden>
</inputs_forbidden>

<process_flow>
  <step_1>
    <action>{First thing to do}</action>
    <process>
      1. {Substep 1}
      2. {Substep 2}
      3. {Substep 3}
    </process>
    <validation>{How to verify this step succeeded}</validation>
    <output>{What this step produces}</output>
  </step_1>

  <step_2>
    <action>{Second thing to do}</action>
    <process>
      1. {Substep 1}
      2. {Substep 2}
    </process>
    <conditions>
      <if test="{condition_a}">{Do option A}</if>
      <else>{Do option B}</else>
    </conditions>
    <output>{What this step produces}</output>
  </step_2>

  <step_3>
    <action>{Final thing to do}</action>
    <process>
      1. {Substep 1}
      2. {Substep 2}
    </process>
    <output>{Final output}</output>
  </step_3>
</process_flow>

<output_format>
  - Successful: {YAML or JSON structure for success case}
  - Error: {Error response structure with error codes}
</output_format>

<quality_criteria>
  <criterion>{Requirement 1 — e.g., "All required fields present"}</criterion>
  <criterion>{Requirement 2 — e.g., "Output matches schema"}</criterion>
  <criterion>{Requirement 3 — e.g., "No placeholder values"}</criterion>
</quality_criteria>
```

## Design Principles

| Principle | Why |
|-----------|-----|
| **Stateless** | No conversation history — prevents context contamination and reduces token usage |
| **Single responsibility** | One specific task, done extremely well — enables focused, high-quality outputs |
| **Structured output** | Always returns YAML/JSON — enables reliable parsing and validation |
| **Explicit validation** | Each step has its own validation — catches errors early, prevents cascading failures |
| **Complete instructions** | Every call includes ALL needed context — subagents never infer or guess |
