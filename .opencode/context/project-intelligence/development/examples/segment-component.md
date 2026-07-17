<!-- Context: project-intelligence/development/segment-component | Priority: medium | Version: 1.0 | Updated: 2026-07-16 -->

# Example: Segment Component Pattern

**Core Idea**: Extracted form segments receive specific props + individual onChange handlers. Orchestrator maintains state and passes callbacks down.

```typescript
// BasicInfoSegment — receives title, description, body + individual onChanges
interface BasicInfoSegmentProps {
  title: string
  description: string
  body: string
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onBodyChange: (value: string) => void
  errors?: Record<string, string | undefined>
}

// TaxonomyMultiSelect — generic for all 6 N:M taxonomies
interface TaxonomyMultiSelectProps {
  label: string
  items: TaxonomyItem[]
  selectedIds: string[]
  onChange: (id: string) => void
}
```

**Pattern rules**:
- Each segment = one JSX section by functionality
- Props include ALL fields the segment renders + individual onChange per field
- Optional `errors` record for validation display
- Orchestrator imports and composes segments; keeps all business logic
- No state in segments — they render what they receive

**Reference**: `components/prompt/{BasicInfoSegment,MetadataSegment,AdvancedSegment,TaxonomyMultiSelect}.tsx`

**Related**:
- concepts/component-refactor-pattern.md
- guides/refactor-large-components.md
