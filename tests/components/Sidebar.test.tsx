/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import { Sidebar } from "@/components/layout/Sidebar"
import { UIContextProvider } from "@/contexts/UIContext"
import messages from "../../messages/en-GB.json"

jest.mock("next-auth/react", () => ({
  useSession: () => ({ data: { user: { name: "Test User" } }, status: "authenticated" }),
  signOut: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  usePathname: () => "/prompts",
}))

function renderSidebar(initialSidebarCollapsed = false) {
  return render(
    <NextIntlClientProvider locale="en-GB" messages={messages}>
      <UIContextProvider initialSidebarCollapsed={initialSidebarCollapsed}>
        <Sidebar />
      </UIContextProvider>
    </NextIntlClientProvider>
  )
}

describe("Sidebar", () => {
  beforeEach(() => {
    // jsdom does not expose fetch; provide it for the PATCH calls
    global.fetch = jest.fn().mockResolvedValue({ ok: true } as Response) as typeof fetch
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders app name and navigation links in expanded mode by default", () => {
    // Arrange & Act
    const { container } = renderSidebar()

    // Assert
    expect(screen.getByText("Prompt DB")).toBeInTheDocument()
    expect(screen.getByText("Prompts")).toBeInTheDocument()
    expect(screen.getByText("Categories")).toBeInTheDocument()
    expect(screen.getByText("Tags")).toBeInTheDocument()
    expect(screen.getByText("Test User")).toBeInTheDocument()
    expect(container.firstChild).toHaveClass("w-64")
  })

  it("collapses to icon-only width and hides labels when initialSidebarCollapsed is true", () => {
    // Arrange & Act
    const { container } = renderSidebar(true)

    // Assert
    expect(container.firstChild).toHaveClass("w-16")
    expect(screen.queryByText("Prompt DB")).not.toBeInTheDocument()
    // Nav names only exist as opacity-0 tooltips when collapsed
    expect(screen.queryByText("Prompts")).toHaveClass("opacity-0")
  })

  it("persists the new collapsed state via a PATCH request when the collapse button is clicked", () => {
    // Arrange
    renderSidebar()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Collapse sidebar" }))

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/user/preferences",
      expect.objectContaining({
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uiPreferences: { sidebarCollapsed: true } }),
      })
    )
  })
})
