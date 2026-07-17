---
source: Context7 API
library: Awesome Software Architecture
package: software-architecture
topic: clean-architecture-project-structure
fetched: 2026-07-14T10:00:00Z
official_docs: https://github.com/mehdihadeli/awesome-software-architecture
---

# Clean Architecture & Software Project Structure

## Clean Architecture Overview

Source: Awesome Software Architecture

**Clean Architecture** is a software design philosophy that emphasizes the separation of concerns, making systems easier to understand, test, and maintain. It promotes a layered approach where dependencies point inwards, protecting the core business logic from external frameworks and technologies.

## Key Principles for Project Organization

1. **Use cases as the central organizing structure** — organize around business use cases, not technical layers
2. **Separation of concerns** — each layer has a distinct responsibility
3. **Dependency inversion** — dependencies point inward toward business logic
4. **Framework decoupling** — business logic should not depend on external frameworks

## Hexagonal Architecture (Ports & Adapters)

Source: Awesome Software Architecture

Organizes code into:
- **Domain/Core** — business logic (innermost layer, no dependencies)
- **Application/Use Cases** — application-specific business rules
- **Infrastructure/Adapters** — external concerns (DB, API, UI)
- **Ports** — interfaces that define boundary contracts

## Sample Template Structures

### Clean Architecture .NET Template
Utilizes use cases as the central organizing structure for testable and decoupled code:
```
src/
├── Domain/               # Enterprise business rules
├── Application/          # Use cases / application logic
├── Infrastructure/       # External concerns
└── Web/                  # Presentation / API layer
```

### Real-world Example
The `clean-architecture-manga` project showcases Clean Architecture with:
- Use cases as the central organizing structure
- Testability as a first-class concern
- Framework decoupling

## DDD (Domain-Driven Design) Best Practices

- Organize code by domain/bounded context
- Each bounded context has its own models, services, and repositories
- Shared kernel for common concepts across contexts
