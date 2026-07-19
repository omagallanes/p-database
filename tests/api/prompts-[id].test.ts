/**
 * @jest-environment node
 */

// Mock auth module BEFORE importing the route
const mockAuth = jest.fn()
jest.mock("@/lib/auth", () => ({
  auth: () => mockAuth(),
  signIn: jest.fn(),
  signOut: jest.fn(),
  handlers: {
    GET: jest.fn(),
    POST: jest.fn(),
  },
}))

import { GET, PUT, DELETE } from "@/app/api/prompts/[id]/route"
import { prisma } from "@/lib/prisma"
import { NextRequest } from "next/server"

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  prisma: {
    prompt: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    promptTag: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    promptCategory: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    promptPlatform: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    promptClientProject: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    promptUseCase: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    promptModelHint: {
      deleteMany: jest.fn(),
      create: jest.fn(),
    },
    category: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    $transaction: jest.fn(async (fn) => {
      // Mock transaction by just executing the function
      return await fn({
        prompt: {
          update: jest.fn(),
        },
        promptTag: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
        promptCategory: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
        promptPlatform: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
        promptClientProject: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
        promptUseCase: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
        promptModelHint: {
          deleteMany: jest.fn(),
          create: jest.fn(),
        },
      })
    }),
  },
}))

describe("/api/prompts/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("should return 200 with prompt and N:M relations", async () => {
      // Mock authenticated session
      mockAuth.mockResolvedValue({
        user: {
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
          role: "user",
        },
      })

      // Mock prompt with N:M relations
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        title: "Test Prompt",
        body: "Prompt body",
        userId: "user-123",
        platforms: [{ platform: { id: "p1", name: "CHATGPT" } }],
        categories: [{ category: { id: "c1", name: "Writing" } }],
        clientProjects: [{ clientProject: { id: "cp1", name: "Project A" } }],
        useCases: [{ useCase: { id: "u1", name: "Email" } }],
        modelHints: [{ modelHint: { id: "m1", name: "GPT-4" } }],
        tags: [{ tag: { id: "t1", name: "Important" } }],
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1")
      const response = await GET(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data).toHaveProperty("data")
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty("id", "prompt-1")
      expect(data.data).toHaveProperty("platforms")
      expect(data.data).toHaveProperty("categories")
    })
  })

  describe("PUT", () => {
    it("should return 401 without authentication", async () => {
      // Mock unauthenticated session
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated" }),
      })
      const response = await PUT(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(401)
    })

    it("should update prompt when user is owner", async () => {
      // Mock authenticated session (owner)
      mockAuth.mockResolvedValue({
        user: {
          id: "owner-123",
          name: "Owner User",
          email: "owner@example.com",
          role: "user",
        },
      })

      // Mock existing prompt (owned by user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      // Mock prompt update
      ;(prisma.prompt.update as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        title: "Updated Prompt",
        userId: "owner-123",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "PUT",
        body: JSON.stringify({ title: "Updated Prompt" }),
      })
      const response = await PUT(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("should return 403 when user is not owner", async () => {
      // Mock authenticated session (not owner)
      mockAuth.mockResolvedValue({
        user: {
          id: "other-user",
          name: "Other User",
          email: "other@example.com",
          role: "user",
        },
      })

      // Mock existing prompt (owned by different user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "PUT",
        body: JSON.stringify({ title: "Hacked" }),
      })
      const response = await PUT(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toEqual({ error: "Forbidden" })
    })

    it("should allow admin to update any prompt (admin bypass)", async () => {
      // Mock authenticated session (admin)
      mockAuth.mockResolvedValue({
        user: {
          id: "admin-123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      })

      // Mock existing prompt (owned by different user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "other-user",
      })

      // Mock prompt update
      ;(prisma.prompt.update as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        title: "Admin Updated",
        userId: "other-user",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "PUT",
        body: JSON.stringify({ title: "Admin Updated" }),
      })
      const response = await PUT(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("should update N:M relations with $transaction", async () => {
      // Mock authenticated session (owner)
      mockAuth.mockResolvedValue({
        user: {
          id: "owner-123",
          name: "Owner User",
          email: "owner@example.com",
          role: "user",
        },
      })

      // Mock existing prompt
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      // Mock prompt update
      ;(prisma.prompt.update as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "PUT",
        body: JSON.stringify({
          title: "Updated",
          platformIds: ["p1", "p2"],
          categoryIds: ["c1"],
          tagIds: ["t1", "t2"],
        }),
      })
      await PUT(request, { params: { id: "prompt-1" } })

      // Verify $transaction was called for N:M relations
      expect(prisma.$transaction).toHaveBeenCalled()
    })
  })

  describe("DELETE", () => {
    it("should return 401 without authentication", async () => {
      // Mock unauthenticated session
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(401)
    })

    it("should delete prompt when user is owner", async () => {
      // Mock authenticated session (owner)
      mockAuth.mockResolvedValue({
        user: {
          id: "owner-123",
          name: "Owner User",
          email: "owner@example.com",
          role: "user",
        },
      })

      // Mock existing prompt (owned by user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      // Mock prompt delete
      ;(prisma.prompt.delete as jest.Mock).mockResolvedValue({
        id: "prompt-1",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("should return 403 when user is not owner", async () => {
      // Mock authenticated session (not owner)
      mockAuth.mockResolvedValue({
        user: {
          id: "other-user",
          name: "Other User",
          email: "other@example.com",
          role: "user",
        },
      })

      // Mock existing prompt (owned by different user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "owner-123",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(403)
      const data = await response.json()
      expect(data).toEqual({ error: "Forbidden" })
    })

    it("should allow admin to delete any prompt (admin bypass)", async () => {
      // Mock authenticated session (admin)
      mockAuth.mockResolvedValue({
        user: {
          id: "admin-123",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        },
      })

      // Mock existing prompt (owned by different user)
      ;(prisma.prompt.findUnique as jest.Mock).mockResolvedValue({
        id: "prompt-1",
        userId: "other-user",
      })

      // Mock prompt delete
      ;(prisma.prompt.delete as jest.Mock).mockResolvedValue({
        id: "prompt-1",
      })

      const request = new NextRequest("http://localhost:3000/api/prompts/prompt-1", {
        method: "DELETE",
      })
      const response = await DELETE(request, { params: { id: "prompt-1" } })

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})
