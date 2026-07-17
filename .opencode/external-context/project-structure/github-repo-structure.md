---
source: Context7 API
library: GitHub
package: github
topic: repository-structure-best-practices
fetched: 2026-07-14T10:00:00Z
official_docs: https://docs.github.com/en/repositories
---

# GitHub Repository Structure Best Practices

## Repository-wide Copilot Instructions — Canonical Structure Example

Source: GitHub Docs

A well-documented repository structure enables effective collaboration. The following structure is recommended for a Go-based service:

```markdown
## Repository Structure
- `cmd/`: Main service entry points and executables
- `internal/`: Logic related to interactions with other GitHub services
- `lib/`: Core Go packages for billing logic
- `admin/`: Admin interface components
- `config/`: Configuration files and templates
- `docs/`: Documentation
- `proto/`: Protocol buffer definitions. Run `make proto` after making updates here.
- `ruby/`: Ruby implementation components
- `testing/`: Test helpers and fixtures
```

## Example Copilot Instructions — General Web App Structure

Source: GitHub Docs

Standard folder structure for a web application:

```markdown
## Folder Structure
- /src: Contains the source code for the frontend.
- /server: Contains the source code for the Node.js backend.
- /docs: Contains documentation for the project, including API specifications and user guides.

## Libraries and Frameworks
- React and Tailwind CSS for the frontend.
- Node.js and Express for the backend.
- MongoDB for data storage.
```

## Writing Effective Repository Custom Instructions

Source: GitHub Docs

Effective repository-level documentation should include:
1. **Project overview**: purpose, goals, background
2. **Repository folder structure**: highlighting important directories/files
3. **Coding standards and conventions**: naming, formatting, best practices
4. **Tools, libraries, frameworks**: including version numbers and configurations

## GitHub Organization Structure for Migrations

Source: GitHub Docs

Best practices for structuring organizations in your enterprise:
- Minimize the number of organizations
- Structure them according to one of five archetypes
- Design for collaboration and discovery while minimizing administrative burden
- Avoid creating unnecessary silos and administrative overhead
