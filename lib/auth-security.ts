import { prisma } from "@/lib/prisma"

/** Max consecutive failed logins before the account is locked. */
export const MAX_FAILED_ATTEMPTS = 5
/** Lockout duration after reaching MAX_FAILED_ATTEMPTS (15 minutes). */
export const LOCKOUT_DURATION_MS = 15 * 60 * 1000

/**
 * True when the account is currently locked out. A null/undefined
 * lockoutUntil (or one that has already expired) means the account is free.
 */
export function isAccountLocked(
  lockoutUntil: Date | null | undefined,
  now: Date = new Date()
): boolean {
  return Boolean(lockoutUntil && lockoutUntil > now)
}

/**
 * Computes the fields to persist after a failed login attempt. The counter
 * is incremented below the threshold; at the threshold the account is locked
 * for LOCKOUT_DURATION_MS and the counter is reset so a successful login
 * after the lockout starts from zero.
 */
export function failedAttemptUpdate(currentAttempts: number): {
  failedLoginAttempts: number
  lockoutUntil: Date | null
} {
  const nextAttempts = currentAttempts + 1
  if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
    return {
      failedLoginAttempts: 0,
      lockoutUntil: new Date(Date.now() + LOCKOUT_DURATION_MS),
    }
  }
  return { failedLoginAttempts: nextAttempts, lockoutUntil: null }
}

/**
 * Checks whether a session token has been revoked by a password change
 * (tokenVersion bumped in the DB). Returns true when the user no longer
 * exists or the stored version differs from the token's. Fail-open: any DB
 * error keeps the session valid so an outage never locks users out.
 */
export async function isSessionRevoked(
  tokenId: string,
  tokenVersion: number
): Promise<boolean> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: tokenId },
      select: { tokenVersion: true },
    })
    return !dbUser || dbUser.tokenVersion !== tokenVersion
  } catch {
    return false
  }
}

/**
 * Produces a "revoked" token payload: same structure, but without identity
 * fields (id/role) and with language nulled, forcing a re-login. All other
 * JWT fields (name, email, iat, exp...) are preserved.
 */
export function revokeTokenPayload<T extends {
  id?: string
  role?: string
  language?: string | null
}>(token: T): T {
  return { ...token, id: undefined, role: undefined, language: null }
}
