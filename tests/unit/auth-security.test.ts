/**
 * @jest-environment node
 */

// Mock Prisma: lib/auth-security talks to the DB only through @/lib/prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from "@/lib/prisma"
import {
  failedAttemptUpdate,
  isAccountLocked,
  isSessionRevoked,
  revokeTokenPayload,
  LOCKOUT_DURATION_MS,
  MAX_FAILED_ATTEMPTS,
} from "@/lib/auth-security"

describe("auth-security", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("isAccountLocked", () => {
    it("returns true when lockoutUntil is in the future", () => {
      expect(isAccountLocked(new Date(Date.now() + 60_000))).toBe(true)
    })

    it("returns false when lockoutUntil is in the past", () => {
      expect(isAccountLocked(new Date(Date.now() - 60_000))).toBe(false)
    })

    it("returns false when lockoutUntil is null or undefined", () => {
      expect(isAccountLocked(null)).toBe(false)
      expect(isAccountLocked(undefined)).toBe(false)
    })
  })

  describe("failedAttemptUpdate", () => {
    it("increments the counter below the threshold", () => {
      expect(failedAttemptUpdate(2)).toEqual({
        failedLoginAttempts: 3,
        lockoutUntil: null,
      })
    })

    it("locks the account and resets the counter at the threshold", () => {
      const update = failedAttemptUpdate(MAX_FAILED_ATTEMPTS - 1)

      expect(update.failedLoginAttempts).toBe(0)
      expect(update.lockoutUntil).toBeInstanceOf(Date)
      const lockoutUntil = update.lockoutUntil as Date
      expect(lockoutUntil.getTime()).toBeGreaterThan(Date.now())
      expect(lockoutUntil.getTime()).toBeLessThanOrEqual(
        Date.now() + LOCKOUT_DURATION_MS
      )
    })
  })

  describe("isSessionRevoked", () => {
    it("returns false when the stored tokenVersion matches", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ tokenVersion: 3 })

      await expect(isSessionRevoked("u1", 3)).resolves.toBe(false)
    })

    it("returns true when the stored tokenVersion differs (password rotated)", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ tokenVersion: 4 })

      await expect(isSessionRevoked("u1", 3)).resolves.toBe(true)
    })

    it("returns true when the user no longer exists", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(isSessionRevoked("u1", 3)).resolves.toBe(true)
    })

    it("fails open (returns false) when the database query fails", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockRejectedValue(
        new Error("db down")
      )

      await expect(isSessionRevoked("u1", 3)).resolves.toBe(false)
    })

    it("queries only the tokenVersion field", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue({ tokenVersion: 3 })

      await isSessionRevoked("u1", 3)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "u1" },
        select: { tokenVersion: true },
      })
    })
  })

  describe("revokeTokenPayload", () => {
    it("strips identity fields while preserving the rest of the token", () => {
      const revoked = revokeTokenPayload({
        id: "u1",
        role: "admin",
        language: "es",
        name: "Ana",
        tokenVersion: 2,
      })

      expect(revoked.id).toBeUndefined()
      expect(revoked.role).toBeUndefined()
      expect(revoked.language).toBeNull()
      expect(revoked.name).toBe("Ana")
      expect(revoked.tokenVersion).toBe(2)
    })
  })
})
