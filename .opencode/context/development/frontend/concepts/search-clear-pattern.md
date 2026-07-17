<!-- Context: development/frontend/concepts | Priority: medium | Version: 1.0 | Updated: 2026-07-17 -->

# Concept: Search Clear Button with State Reset + Navigation

**Core Idea**: When search state lives in a client component (not URL params), provide a "Clear" button that resets the input AND navigates back to the base list page. The button is visible only when search text exists.

---

## Key Points

- **Conditional visibility**: Only render when `searchQuery.length > 0`
- **Dual action**: Clear state (`setSearchQuery("")`) AND navigate (`router.push("/prompts")`)
- **Placement**: Outside the `<form>` element, to the right of the search input
- **Visual style**: Minimal text button with hover underline/color change

## Pattern

```tsx
// In the component:
const [searchQuery, setSearchQuery] = useState("")
const router = useRouter()

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault()
  const params = new URLSearchParams()
  if (searchQuery) params.set("search", searchQuery)
  router.push(`/prompts?${params.toString()}`)
}

return (
  <>
    <form onSubmit={handleSearch}>
      <div className="relative">
        <Search className="absolute left-3 ..." />
        <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
      </div>
    </form>
    {searchQuery.length > 0 && (
      <button
        type="button"
        onClick={() => {
          setSearchQuery("")
          router.push("/prompts")
        }}
        className="text-sm text-purple-600 hover:text-purple-800 hover:underline px-2"
      >
        Clear
      </button>
    )}
  </>
)
```

## Why This Works

- **State reset** clears the search input locally
- **Navigation** resets URL search params on the list page
- **Conditional render** keeps UI clean when no search is active
- **Outside `<form>`** prevents accidental form submission on click

**Reference**: `components/layout/Topbar.tsx` (lines 98-109)

**Related**: `frontend/concepts/filter-patterns.md`, `backend/lookup/searchable-fields-dimensions.md`
