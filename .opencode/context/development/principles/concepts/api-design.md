<!-- Context: development/api-design | Priority: low | Version: 1.0 | Updated: 2026-02-15 -->

# API Design Patterns

**Category**: development  
**Purpose**: REST API design principles, GraphQL patterns, and API versioning strategies  
**Used by**: opencoder

---

## Overview

This guide covers best practices for designing robust, scalable, and maintainable APIs, including REST, GraphQL, and versioning strategies.

## REST API Design

### 1. Resource-Based URLs

**Use nouns, not verbs**:
```
# Bad
GET  /getUsers, POST /createUser, POST /updateUser/123
# Good
GET    /users, POST   /users, PUT    /users/123
PATCH  /users/123, DELETE /users/123
```

### 2. HTTP Methods
- `GET` - Retrieve (idempotent, safe)
- `POST` - Create new resources
- `PUT` - Replace entire resource (idempotent)
- `PATCH` - Partial update (idempotent)
- `DELETE` - Remove resource (idempotent)

### 3. Status Codes

**2xx Success**: 200 OK (GET/PUT/PATCH), 201 Created (POST), 204 No Content (DELETE)
**4xx Client**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity
**5xx Server**: 500 Internal Server Error, 503 Service Unavailable

### 4. Consistent Response Format

```json
// Success
{ "data": { "id": "123", "name": "John Doe" }, "meta": { "timestamp": "..." } }
// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "Invalid input", "details": [...] }, "meta": { "timestamp": "...", "requestId": "abc-123" } }
// Collection
{ "data": [...], "meta": { "total": 100, "page": 1, "pageSize": 20, "totalPages": 5 }, "links": { "self": "...", "next": "...", "prev": null } }
```

### 5. Filtering, Sorting, Pagination
```
GET /users?status=active&role=admin           # Filtering
GET /users?sort=createdAt:desc,name:asc       # Sorting
GET /users?page=2&pageSize=20                 # Pagination
GET /users?fields=id,name,email               # Field selection
GET /users?q=john                             # Search
```

### 6. Nested Resources
```
# Good: GET /users/123/posts or GET /posts?userId=123
# Avoid deep nesting: GET /users/123/posts/456/comments/789
# Better: GET /comments/789
```

## GraphQL Patterns

### 1. Schema Design
```graphql
type User { id: ID!; name: String!; email: String!; posts: [Post!]!; createdAt: DateTime! }
type Post { id: ID!; title: String!; content: String!; author: User!; comments: [Comment!]! }
type Query { user(id: ID!): User; users(filter: UserFilter, page: Int, pageSize: Int): UserConnection! }
type Mutation { createUser(input: CreateUserInput!): User!; updateUser(...): User!; deleteUser(id: ID!): Boolean! }
input CreateUserInput { name: String!; email: String! }
input UserFilter { status: UserStatus; role: UserRole; search: String }
```

### 2. Resolver Patterns
```javascript
const resolvers = {
  Query: { user: (_, { id }, { dataSources }) => dataSources.userAPI.getUser(id),
    users: (_, { filter, page, pageSize }, { dataSources }) => dataSources.userAPI.getUsers({ filter, page, pageSize }) },
  User: { posts: (user, _, { dataSources }) => dataSources.postAPI.getPostsByUserId(user.id) },
  Mutation: { createUser: async (_, { input }, { dataSources, user }) => {
    if (!user) throw new AuthenticationError('Not authenticated');
    return dataSources.userAPI.createUser(validateUserInput(input));
  }}
};
```

### 3. DataLoader for N+1 Prevention
```javascript
import DataLoader from 'dataloader';
const userLoader = new DataLoader(async (ids) => {
  const users = await db.users.findMany({ where: { id: { in: ids } } });
  return ids.map(id => users.find(u => u.id === id));
});
// Usage: const user = await userLoader.load(userId);
```

## API Versioning

### 1. URL Versioning: `GET /v1/users`, `GET /v2/users` — Clear, easy to route
### 2. Header Versioning: `Accept: application/vnd.myapi.v2+json` — Clean URLs, less visible
### 3. Deprecation Strategy
```javascript
// Headers: Deprecation: true | Sunset: Sat, 31 Dec 2024 23:59:59 GMT
// Link: <https://api.example.com/v2/users>; rel="successor-version"
```

## Authentication & Authorization

### 1. JWT Tokens
```javascript
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid token' }); }
}
```

### 2. Role-Based Access Control
```javascript
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Insufficient permissions' });
    next();
  };
}
// Usage: app.delete('/users/:id', authenticateToken, authorize('admin'), deleteUser);
```

## Frontend API Client (TanStack Query)

**For optimal client-side API consumption**:
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
const apiClient = { getUsers: (filters) => fetch(`/api/v1/users?${new URLSearchParams(filters)}`).then(r => r.json()) };
function UsersList() {
  const { data, isPending, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiClient.getUsers(filters),
    staleTime: 5 * 60 * 1000,
  });
  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return data?.data.map(user => <UserCard key={user.id} user={user} />);
}
```

## Best Practices

1. **Use HTTPS everywhere** — Encrypt all API traffic
2. **Implement rate limiting** — Prevent abuse and ensure fair usage
3. **Validate all inputs** — Never trust client data
4. **Use proper error handling** — Return meaningful error messages
5. **Document your API** — Use OpenAPI/Swagger or GraphQL introspection
6. **Version your API** — Plan for breaking changes
7. **Implement CORS properly** — Configure allowed origins carefully
8. **Log requests and errors** — Enable debugging and monitoring
9. **Use caching** — Implement ETags, Cache-Control headers
10. **Test thoroughly** — Unit, integration, and contract tests

## Anti-Patterns

- ❌ Exposing internal IDs — Use UUIDs or opaque identifiers
- ❌ Returning too much data — Support field selection
- ❌ Ignoring idempotency — PUT/PATCH/DELETE should be idempotent
- ❌ Inconsistent naming — Use camelCase or snake_case consistently
- ❌ Missing pagination — Always paginate collections
- ❌ No rate limiting — Protect against abuse
- ❌ Verbose error messages — Don't leak implementation details
- ❌ Synchronous long operations — Use async jobs for long tasks

## References

- REST API Design Rulebook by Mark Masse
- GraphQL Best Practices (graphql.org)
- API Design Patterns by JJ Geewax
- OpenAPI Specification (swagger.io)