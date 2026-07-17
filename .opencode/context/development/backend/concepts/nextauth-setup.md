<!-- Context: development/backend/concepts | Priority: high | Version: 1.0 | Updated: 2026-07-14 -->

# Concept: NextAuth.js Setup (JWT + Credentials)

**Core Idea**: NextAuth.js v5 beta with JWT strategy, CredentialsProvider (email+password), PrismaAdapter, and custom pages. JWT embeds `id` and `role` for stateless auth.

**Key Points**:
- **JWT strategy**: No DB lookups per request (ideal for serverless)
- **CredentialsProvider**: Email + password with bcryptjs comparison
- **Zod validation**: Credentials parsed with `.safeParse` before DB lookup
- **JWT callbacks**: Embed `token.id` and `token.role` from DB user
- **Session callbacks**: Expose `session.user.id` and `session.user.role` to components
- **Custom pages**: signIn at `/auth/signin`, error at `/auth/error`
- **Type augmentation**: `types/next-auth.d.ts` extends Session.user and JWT types

**Config reference** (`lib/auth.ts`):
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/auth/signin", error: "/auth/error" },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // Zod parse → findUnique → bcrypt.compare → return user | null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = user.role }
      return token
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; session.user.role = token.role }
      return session
    }
  }
})
```

**Middleware** (`middleware.ts`): Protects all routes except `/auth/signin`, `/auth/signup`, `/auth/error`. Redirects unauthenticated users to signin, authenticated users away from public auth pages.

**Reference**: `lib/auth.ts`, `middleware.ts`, `types/next-auth.d.ts`
