<!-- Context: development/frontend/concepts | Priority: high | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: Segmented Form Pattern (PromptForm)

**Core Idea**: PromptForm (1021 lines — largest component) uses a 3-segment layout: Basic Information → Metadata → Advanced. Each segment is a visual section with collapsible/visible areas. N:M multi-select via composable taxonomy pickers.

**Key Points**:
- **3 segments**: `BasicInfo` (title, body, type, status), `Metadata` (language, category, tags, platform), `Advanced` (prePrompt, manualDeUso, changelog, notes, version)
- **Taxonomy multi-select**: Each N:M relation (platforms, categories, tags, use cases, client projects, model hints) uses a `Command`-based multi-select component with search
- **State**: React Hook Form with Zod resolver — schema mirrors `createPromptSchema`
- **Navigation**: Tab-like segment headers; only one segment visible at a time
- **Loading state**: Skeleton placeholders during data fetch for taxonomy options

**Quick example** (taxonomy multi-select):
```tsx
// Composable pattern for each N:M taxonomy
<FormField control={form.control} name="tagIds" render={({ field }) => (
  <FormItem>
    <FormLabel>Tags</FormLabel>
    <MultiSelect
      options={tags.map(t => ({ label: t.name, value: t.id }))}
      selected={field.value || []}
      onChange={field.onChange}
      placeholder="Search tags..."
    />
  </FormItem>
)} />
```

**Refactoring note**: At 1021 lines, this component is a candidate for splitting into `BasicInfoSegment`, `MetadataSegment`, `AdvancedSegment`, with taxonomy multi-select extracted as a shared `TaxonomyMultiSelect` component.

**Reference**: `components/prompt/PromptForm.tsx`, `components/ui/multi-select.tsx`
