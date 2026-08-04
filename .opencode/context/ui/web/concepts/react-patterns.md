<!-- Context: ui/react-patterns | Priority: low | Version: 2.0 | Updated: 2026-07-14 -->
# React Patterns & Best Practices

**Core Idea**: Modern React with functional components, hooks, composition over prop drilling, and minimal state management. TypeScript strict mode required. No class components.

---

## Component Patterns

### 1. Functional Components with Hooks
```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null)
  useEffect(() => { fetchUser(userId).then(setUser) }, [userId])
  return <div>{user?.name}</div>
}
```

### 2. Custom Hooks for Reusable Logic
```jsx
function useUser(userId) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    fetchUser(userId).then(setUser).catch(setError).finally(() => setLoading(false))
  }, [userId])
  return { user, loading, error }
}

// Usage
function UserProfile({ userId }) {
  const { user, loading, error } = useUser(userId)
  if (loading) return <Spinner />
  if (error) return <Error message={error.message} />
  return <div>{user.name}</div>
}
```

### 3. Composition Over Props Drilling
```jsx
// ❌ Bad: Props drilling through 5+ levels
function App() { return <Layout theme={theme} setTheme={setTheme} /> }

// ✅ Good: Context for shared state
const ThemeContext = createContext()
function App() {
  const [theme, setTheme] = useState('light')
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Layout />
    </ThemeContext.Provider>
  )
}
function Layout() { const { theme } = useContext(ThemeContext); return <div className={theme}>...</div> }
```

### 4. Compound Components
```jsx
function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0)
  return <TabsContext.Provider value={{ activeTab, setActiveTab }}>{children}</TabsContext.Provider>
}
Tabs.List = function({ children }) { return <div className="tabs-list">{children}</div> }
Tabs.Tab = function({ index, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  return <button className={activeTab === index ? 'active' : ''} onClick={() => setActiveTab(index)}>{children}</button>
}
Tabs.Panel = function({ index, children }) {
  const { activeTab } = useContext(TabsContext)
  return activeTab === index ? <div>{children}</div> : null
}

// Usage: <Tabs><Tabs.List><Tabs.Tab index={0}>Tab 1</Tabs.Tab></Tabs.List><Tabs.Panel index={0}>Content</Tabs.Panel></Tabs>
```

---

## Hooks Best Practices

### useEffect Dependencies
**Always specify ALL dependencies**. Missing deps cause stale closures.
```jsx
// ✅ Correct
useEffect(() => { fetchData(userId) }, [userId])

// For stable function references
const fetchData = useCallback((id) => api.getUser(id).then(setUser), [])
useEffect(() => { fetchData(userId) }, [userId, fetchData])
```

### useMemo for Expensive Calculations
```jsx
// Memoize filtered/sorted data, not simple operations
const filteredData = useMemo(() => data.filter(item => filters.every(f => f(item))), [data, filters])
```

### useCallback for Stable References
```jsx
// Prevents child re-renders when used with React.memo
const handleClick = useCallback(() => setCount(c => c + 1), [])
const Child = memo(function Child({ onClick }) { return <button onClick={onClick}>Click</button> })
```

---

## State Management (Order of Preference)

| Approach | When to Use | Example |
|----------|-------------|---------|
| **Local state** (`useState`) | Default for component-only state | Form input, toggle |
| **Lifted state** | Siblings share state via common parent | Two components read same counter |
| **Context** (`useContext`) | Many components at different levels need same data | Theme, user auth, view mode |
| **useReducer** | Complex interrelated state updates | Form with many fields, multi-step wizard |

### useReducer for Complex State
```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'increment': return { ...state, count: state.count + state.step }
    case 'decrement': return { ...state, count: state.count - state.step }
    case 'setStep': return { ...state, step: action.payload }
    default: return state
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 })
  return <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
}
```

---

## Performance Optimization

### Code Splitting
```jsx
const Dashboard = lazy(() => import('./Dashboard'))
const Settings = lazy(() => import('./Settings'))

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  )
}
```

### Virtualization for Long Lists
Use `react-window` for lists >100 items:
```jsx
import { FixedSizeList } from 'react-window'
function VirtualList({ items }) {
  const Row = ({ index, style }) => <div style={style}>{items[index].name}</div>
  return <FixedSizeList height={600} itemCount={items.length} itemSize={50} width="100%">{Row}</FixedSizeList>
}
```

---

## Best Practices

| ✅ Do | ❌ Don't |
|-------|----------|
| Keep components small (single responsibility) | Prop drilling through 5+ levels |
| Use TypeScript strict mode | Mutate state directly (`state.x = y`) |
| Colocate components, styles, tests | Use index as `key` prop |
| Handle loading + error states | Unnecessary `useEffect` (derive state from props) |
| Use fragments (`<>...</>`) | Ignore ESLint hooks warnings |
| Meaningful prop names | Inline functions in JSX (extract or useCallback) |

## References

- [React Documentation](https://react.dev)
- [React Patterns by Kent C. Dodds](https://kentcdodds.com/blog)
- [Epic React by Kent C. Dodds](https://epicreact.dev)
