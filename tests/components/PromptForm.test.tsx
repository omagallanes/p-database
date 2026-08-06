/**
 * @jest-environment jsdom
 *
 * Subtarea 09 — Etapa final: tests del switch isShared en PromptForm.
 * Cubre el render del switch reflejando el valor del prompt, el guardado en
 * edición (PUT con isShared: true) y el alta (POST con isShared: true).
 *
 * Patrón seguido: ProfileUsersTab.test.tsx (fetch global, useSession mock,
 * sonner mock, polyfills Radix Select, mensajes en-GB reales).
 */

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { NextIntlClientProvider } from "next-intl"
import { PromptForm } from "@/components/prompt/PromptForm"
import messages from "../../messages/en-GB.json"

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({ data: null, status: "unauthenticated" })),
}))

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn() }),
}))

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// A complete editable prompt (edit mode pre-fills every field so the Save
// flow works without typing required inputs).
const editPrompt = {
  id: "p1",
  title: "Weekly review",
  description: "A shared review prompt",
  body: "Write an essay",
  type: "USER",
  platform: null,
  modelHint: null,
  language: "en",
  useCase: null,
  clientOrProject: null,
  status: "DRAFT",
  isFavorite: false,
  isShared: false,
  version: 1,
  changelog: null,
  notes: null,
  prePrompt: null,
  manualDeUso: null,
  createdAt: "2026-01-01T10:00:00.000Z",
  updatedAt: "2026-01-01T10:00:00.000Z",
  categories: [],
  tags: [],
  platforms: [],
  clientProjects: [],
  useCases: [],
  modelHints: [],
}

function renderForm(options: { prompt?: typeof editPrompt } = {}) {
  return render(
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      <PromptForm
        prompt={options.prompt}
        categories={[]}
        tags={[]}
        platforms={[]}
        clientProjects={[]}
        useCases={[]}
        modelHints={[]}
      />
    </NextIntlClientProvider>
  )
}

function extractPutBody(fetchMock: jest.Mock, url: string): Record<string, unknown> {
  const call = fetchMock.mock.calls.find(([calledUrl]) => calledUrl === url)
  if (!call) throw new Error(`No fetch call found for ${url}`)
  return JSON.parse(call[1].body as string) as Record<string, unknown>
}

describe("PromptForm shared switch", () => {
  beforeAll(() => {
    // MetadataSegment mounts three Radix Selects; polyfill the APIs that
    // jsdom does not implement (ProfileAccountTab pattern).
    Object.defineProperty(window, "PointerEvent", {
      value: MouseEvent,
      configurable: true,
    })
    Element.prototype.hasPointerCapture = jest.fn()
    Element.prototype.releasePointerCapture = jest.fn()
    Element.prototype.scrollIntoView = jest.fn()
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
    // jsdom does not expose fetch; provide it for the save PUT/POST.
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: { id: "p1" } }),
    } as Response) as typeof fetch
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders the Shared switch with the value of the prompt being edited", () => {
    // Arrange & Act — edit a prompt that is already shared.
    renderForm({ prompt: { ...editPrompt, isShared: true } })

    // Assert — the switch state comes from the prompt (PromptForm.sharedLabel).
    expect(screen.getByRole("switch", { name: "Shared" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("saves the prompt via PUT with isShared true after toggling the switch", async () => {
    // Arrange
    const user = userEvent.setup()
    renderForm({ prompt: editPrompt })

    // Act — toggle the Shared switch and save.
    await user.click(screen.getByRole("switch", { name: "Shared" }))
    await user.click(screen.getByRole("button", { name: "Save" }))

    // Assert — the PUT body carries isShared: true for the edited prompt.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/prompts/p1",
        expect.objectContaining({ method: "PUT" })
      )
    })
    expect(
      extractPutBody(global.fetch as jest.Mock, "/api/prompts/p1")
    ).toMatchObject({ isShared: true, title: "Weekly review" })
  })

  it("creates a new prompt via POST with isShared true when the switch is enabled", async () => {
    // Arrange
    const user = userEvent.setup()
    renderForm()

    // Act — fill the required fields, enable the switch and save.
    await user.type(screen.getByLabelText("Title *"), "New shared prompt")
    await user.type(screen.getByLabelText("Prompt Body *"), "Hello world")
    await user.click(screen.getByRole("switch", { name: "Shared" }))
    await user.click(screen.getByRole("button", { name: "Save" }))

    // Assert — the POST body carries isShared: true.
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/prompts",
        expect.objectContaining({ method: "POST" })
      )
    })
    const postCall = (global.fetch as jest.Mock).mock.calls.find(
      ([calledUrl]) => calledUrl === "/api/prompts"
    )
    const payload = JSON.parse(postCall[1].body as string) as Record<string, unknown>
    expect(payload).toMatchObject({
      title: "New shared prompt",
      isShared: true,
    })
  })
})
