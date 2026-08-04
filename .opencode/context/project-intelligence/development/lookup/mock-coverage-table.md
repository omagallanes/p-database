<!-- Context: project-intelligence/development/lookup-mock-coverage | Priority: low | Version: 1.0 | Updated: 2026-07-16 -->

# Lookup: Prisma Mock Coverage per Entity (Import Flow)

**Core Idea**: Each entity in the import flow uses specific Prisma methods. Mocks must cover ALL of them or tests break with "Cannot read properties of undefined".

| Entidad | Métodos usados | Mock Coverage Required |
|---------|---------------|:---------------------:|
| platform | findFirst, create | ✅ findFirst + create |
| clientProject | findFirst, create | ✅ findFirst + create |
| useCase | findFirst, create | ✅ findFirst + create |
| modelHint | findFirst, create | ✅ findFirst + create |
| category | findUnique, create, update | ✅ findUnique + create + update |
| tag | findUnique, create | ✅ findUnique + create |
| prompt | findFirst, create, update | ✅ findFirst + create + update |
| promptPlatform | create, deleteMany | ✅ create + deleteMany |
| promptCategory | create, deleteMany | ✅ create + deleteMany |
| promptClientProject | create, deleteMany | ✅ create + deleteMany |
| promptUseCase | create, deleteMany | ✅ create + deleteMany |
| promptModelHint | create, deleteMany | ✅ create + deleteMany |
| promptTag | create, deleteMany | ✅ create + deleteMany |

**Mock pattern**: `jest.fn().mockResolvedValue(null)` for find methods, `jest.fn().mockResolvedValue({ id: "..." })` for create/update.

**Reference**: `docs/technical-development-knowledge/PCI-plan-c-completo.md` §5.3
