<!-- Context: project-intelligence/development/mock-transaction | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Example: Mock Pattern for Prisma $transaction

**Core Idea**: `$transaction` must be mocked to EXECUTE the callback function with a fake transaction object, not return a fixed value. The mockTx object must include ALL methods the code uses inside the transaction.

```typescript
// Mock transaction object with ALL required methods
const mockTx = {
  prompt: { update: jest.fn().mockResolvedValue(mockUpdatedPrompt) },
  promptTag: { deleteMany: jest.fn() },
  promptCategory: { deleteMany: jest.fn() },
  promptPlatform: { deleteMany: jest.fn() },
  promptClientProject: { deleteMany: jest.fn() },
  promptUseCase: { deleteMany: jest.fn() },
  promptModelHint: { deleteMany: jest.fn() },
}

// Mock $transaction to execute the callback
;(prisma.$transaction as jest.Mock).mockImplementation(async (fn) => {
  return await fn(mockTx)
})

// Verify in tests
expect(prisma.$transaction).toHaveBeenCalled()
expect(mockTx.promptTag.deleteMany).toHaveBeenCalledWith({ where: { promptId } })
```

**Risks if ignored**: Tests fail with "transaction is not a function". Mock with fixed return value doesn't test actual transactional logic.

**Reference**: `tests/api/prompts-[id].test.ts`, `docs/technical-development-knowledge/PCI-plan-c-completo.md` §4

**Related**:
- examples/mock-entity-upsert.md
- errors/prisma-junction-errors.md (§2.5)
