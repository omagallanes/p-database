<!-- Context: openagents-repo/guides | Priority: high | Version: 1.0 | Updated: 2026-02-15 -->

# Guide: GitHub Issues and Project Board Workflow

**Purpose**: Step-by-step workflow for managing issues and project board  
**Project Board**: https://github.com/users/darrenhinde/projects/2/views/2

---

## Quick Commands Reference

```bash
# List issues
gh issue list --repo darrenhinde/OpenAgentsControl
# Create issue
gh issue create --repo darrenhinde/OpenAgentsControl --title "Title" --body "Body" --label "label1,label2"
# Add to project
gh project item-add 2 --owner darrenhinde --url https://github.com/darrenhinde/OpenAgentsControl/issues/NUMBER
# View/update/close
gh issue view NUMBER --repo darrenhinde/OpenAgentsControl
gh issue edit NUMBER --repo darrenhinde/OpenAgentsControl --add-label "new-label"
gh issue close NUMBER --repo darrenhinde/OpenAgentsControl
```

---

## Step 1: Creating Issues

### Issue Types & Labels

| Type | Labels | Content |
|------|--------|---------|
| Feature Request | `feature`, `enhancement` | Goals, features, success criteria |
| Bug Report | `bug` | Steps to reproduce, expected vs actual |
| Improvement | `enhancement`, `framework` | Current state, proposal, impact |
| Question | `question` | Context, question, use case |

**Priority Labels**: `priority-high` (blocking), `priority-medium` (important), `priority-low` (nice to have)
**Category Labels**: `agents`, `framework`, `evals`, `idea`

### Creating an Issue

```bash
gh issue create --repo darrenhinde/OpenAgentsControl --title "Add new feature X" --body "Description" --label "feature,priority-medium"

# Feature with detailed body
gh issue create --repo darrenhinde/OpenAgentsControl --title "Build plugin system" --label "feature,framework,priority-high" \
  --body "## Overview\nBrief description\n## Goals\n- Goal 1\n## Success Criteria\n- [ ] Criterion 1"
```

---

## Step 2: Adding Issues to Project Board

```bash
# Single issue
gh project item-add 2 --owner darrenhinde --url https://github.com/darrenhinde/OpenAgentsControl/issues/NUMBER

# Multiple issues
for i in {137..142}; do gh project item-add 2 --owner darrenhinde --url https://github.com/darrenhinde/OpenAgentsControl/issues/$i; done

# Verify
gh project item-list 2 --owner darrenhinde --format json | jq '.items[] | {title, status}'
```

---

## Step 3: Processing Issues

### Workflow States
1. **Backlog** → 2. **Todo** → 3. **In Progress** → 4. **In Review** → 5. **Done**

### Assigning Issues

```bash
# Assign to yourself
gh issue edit NUMBER --repo darrenhinde/OpenAgentsControl --add-assignee @me
# Assign to someone
gh issue edit NUMBER --repo darrenhinde/OpenAgentsControl --add-assignee username
```

---

## Step 4: Working on Issues

### Start Work
```bash
gh issue edit NUMBER --repo darrenhinde/OpenAgentsControl --add-assignee @me
git checkout -b feature/issue-NUMBER-description
git commit -m "feat: implement X (#NUMBER)"
```

### Update Progress
```bash
gh issue comment NUMBER --repo darrenhinde/OpenAgentsControl --body "Progress update: Completed X, working on Y"
```

### Complete Work
```bash
gh pr create --repo darrenhinde/OpenAgentsControl --title "Fix #NUMBER: Description" --body "Closes #NUMBER\n\nChanges:\n- Change 1\n- Change 2"
```
After merge, issue auto-closes if PR uses "Closes #NUMBER".

---

## Step 5: Request Processing

**Feature Request**: Create issue with `feature` label → Add to project → Prioritize → Break into subtasks → Assign
**Bug Report**: Create with `bug` label → Add reproduction steps → Prioritize by severity → Assign for investigation
**Improvement**: Create with `enhancement` → Discuss approach → Get consensus → Implement → Track progress

### Breaking Down Large Issues

```bash
# Parent epic
gh issue create --repo darrenhinde/OpenAgentsControl --title "[EPIC] Plugin System" --label "feature,framework,priority-high"
# Subtask referencing parent
gh issue create --repo darrenhinde/OpenAgentsControl --title "Plugin manifest system" --label "feature" --body "Part of #PARENT_NUMBER"
```

---

## Step 6: Issue Templates

### Feature Template
```markdown
## Overview\n## Goals\n## Key Features\n## Related Issues\n## Success Criteria
```
### Bug Template
```markdown
## Description\n## Steps to Reproduce\n## Expected vs Actual\n## Environment (OS, Version, Node)\n## Additional Context
```
### Improvement Template
```markdown
## Current State\n## Proposed Improvement\n## Impact\n## Implementation Approach\n## Success Criteria
```

---

## Step 7: Automation & Integration

**Auto-close**: `Closes #123`, `Fixes #123`, `Resolves #123` in PR descriptions
**Link Issues to PRs**: `gh pr create --body "Implements #123"`
**Reference in Commits**: `git commit -m "feat: add plugin system (#137)"` or `git commit -m "fix: resolve error (closes #140)"`

---

## Best Practices

### Issue Creation
✅ Clear titles | ✅ Detailed descriptions | ✅ Proper labels | ✅ Success criteria | ✅ Link related issues

### Issue Management
✅ Regular triage | ✅ Keep updated | ✅ Close stale issues | ✅ Use milestones | ✅ Assign owners

### Project Board
✅ Update status | ✅ Limit WIP | ✅ Review regularly | ✅ Archive completed

---

## Common Workflows

**User Request**: Receive → Create issue → Add to project → Triage → Assign → Track → Review → Close → Notify
**New Feature**: Create epic → Break into subtasks → Add to board → Prioritize → Assign → Track → Complete
**Bug Triage**: Create bug → Label severity → Add to board → Assign → Reproduce → Fix → PR → Close

---

## Checklist (Before Closing Issue)

- [ ] All success criteria met
- [ ] Tests passing
- [ ] Documentation updated
- [ ] PR merged (if applicable)
- [ ] Related issues updated
- [ ] Stakeholders notified

---

## Related Files

- **Registry guide**: `guides/updating-registry.md`
- **Release guide**: `guides/creating-release.md`
- **Testing guide**: `guides/testing-agent.md`
- **Debugging**: `guides/debugging.md`

---

**Last Updated**: 2026-01-30  
**Version**: 0.5.2
