<!-- Context: project-intelligence/development/guide-rollback | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Guide: Rollback Procedures

**Core Idea**: Revert changes by phase using `git revert` to preserve history. Never hard reset unless local-only.

## Full Plan C Rollback
```bash
# Option 1 (Recommended): Revert individual commits
git revert 006a615  # Fase 3
git revert 9bf6043  # Fase 2 (placeholder fix)
git revert 3072d07  # Fase 2 (PromptForm split)
git revert 866c866  # Fase 1 (M-01)
git revert 8c37bec  # Fase 1

# Option 2: Soft reset (changes stay in staging)
git reset --soft 8c37bec^

# Option 3 (DANGER): Hard reset — loses all local changes
git reset --hard 8c37bec^
```

## Phase-Specific Rollback

**Fase 3 only:**
```bash
git revert 006a615 --no-edit
npm run build
source .env && npx vercel --prod --token="$VERCEL_TOKEN"
```

**Fase 2 only:**
```bash
git revert 9bf6043 --no-edit
git revert 3072d07 --no-edit
```

**Fase 1 only (includes M-01):**
```bash
git revert 866c866 --no-edit  # M-01
git revert 8c37bec --no-edit
# ⚠️ Leaves tests broken again
```

## Post-Rollback
```bash
npm run build
source .env && npx vercel --prod --token="$VERCEL_TOKEN"
npm test
```

## Risks

| Risk | Mitigation |
|------|-----------|
| Tests broken if M-01 not reverted with F1 | Revert `866c866` AFTER `8c37bec` |
| Merge conflicts on revert | Use `--no-edit` and resolve manually |
| DB data unaffected | Rollback doesn't touch existing data |

**Reference**: `docs/technical-development-knowledge/PCI-plan-c-completo.md` §10
