import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import {
  failedAttemptUpdate,
  isAccountLocked,
  isSessionRevoked,
  revokeTokenPayload,
} from "@/lib/auth-security"

// Real bcrypt hash (cost 10) of a random string, used for timing
// equalization when the account does not exist or is locked out.
const DUMMY_PASSWORD_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data
          const user = await prisma.user.findUnique({ where: { email } })
          
          // Timing equalization: unknown accounts and locked accounts run a
          // dummy compare so response time does not reveal their state.
          if (!user || !user.password) {
            await bcrypt.compare(password, DUMMY_PASSWORD_HASH)
            return null
          }

          // Brute-force protection: a locked account gets the same generic
          // "invalid credentials" result — the lockout state is never revealed.
          if (isAccountLocked(user.lockoutUntil)) {
            await bcrypt.compare(password, user.password)
            return null
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password)
          if (passwordsMatch) {
            // Successful login: clear any previous failures. The extra update
            // is the standard trade-off for attempt tracking.
            await prisma.user.update({
              where: { id: user.id },
              data: { failedLoginAttempts: 0, lockoutUntil: null },
            })
            return user
          }

          // Failed login: count the attempt, lock the account at the threshold.
          await prisma.user.update({
            where: { id: user.id },
            data: failedAttemptUpdate(user.failedLoginAttempts),
          })
        }

        console.warn("Invalid credentials")
        return null
      }
    })
  ],
  callbacks: {
    async session({ session, token }) {
      // Revoked session (tokenVersion rotated after a password change):
      // strip the user so every `!session?.user` check fails closed and the
      // middleware treats the request as logged-out (re-login possible).
      if (!token.id) {
        return { ...session, user: undefined }
      }
      if (session.user) {
        if (token.id) session.user.id = token.id
        if (token.role) session.user.role = token.role
        session.user.language = token.language ?? null
        // JWT strategy pre-fills session.user.name from token.name, but set it
        // explicitly so the session always reflects the stored account name.
        if (token.name) session.user.name = token.name
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.language = user.language ?? null
        token.tokenVersion = user.tokenVersion
      }
      // Apply client-side session updates (useSession().update) so name and
      // language changes reflect immediately without re-login. tokenVersion
      // is deliberately left untouched: it only changes via password rotation.
      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name
        if ("language" in session) token.language = session.language ?? null
      }
      // Session revocation: a password change bumps tokenVersion in the DB,
      // so every previously issued JWT (including the current one) becomes
      // stale. On each request without a fresh login, compare versions and
      // strip the identity when they differ, forcing a re-login. Fail-open:
      // a DB error keeps the token as-is so the app stays available.
      if (!user && token.tokenVersion !== undefined && token.id) {
        if (await isSessionRevoked(token.id, token.tokenVersion)) {
          return revokeTokenPayload(token)
        }
      }
      return token
    }
  },
  events: {
    async createUser({ user }) {
      console.warn(`New user created: ${user.email}`)
    }
  }
})
