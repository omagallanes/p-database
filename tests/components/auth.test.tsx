import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { LoginForm } from "@/components/auth/LoginForm"
import { SignupForm } from "@/components/auth/SignupForm"
import { UserProfile } from "@/components/auth/UserProfile"

// Mock next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  useSession: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe("Authentication Components", () => {
  describe("LoginForm", () => {
    it("should render login form", () => {
      render(<LoginForm />)
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument()
    })

    it("should show error for invalid credentials", async () => {
      const { signIn } = require("next-auth/react")
      signIn.mockResolvedValue({ error: "Invalid credentials" })

      render(<LoginForm />)

      const emailInput = screen.getByLabelText(/email/i)
      const passwordInput = screen.getByLabelText(/password/i)
      const submitButton = screen.getByRole("button", { name: /sign in/i })

      fireEvent.change(emailInput, { target: { value: "test@example.com" } })
      fireEvent.change(passwordInput, { target: { value: "wrongpassword" } })
      fireEvent.click(submitButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
      })
    })
  })

  describe("SignupForm", () => {
    it("should render signup form", () => {
      render(<SignupForm />)
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument()
    })
  })

  describe("UserProfile", () => {
    it("should render user profile when authenticated", () => {
      const { useSession } = require("next-auth/react")
      useSession.mockReturnValue({
        data: {
          user: {
            id: "1",
            name: "Test User",
            email: "test@example.com",
            role: "user",
          },
        },
        status: "authenticated",
      })

      render(<UserProfile />)

      expect(screen.getByText(/test user/i)).toBeInTheDocument()
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /sign out/i })).toBeInTheDocument()
    })

    it("should not render when not authenticated", () => {
      const { useSession } = require("next-auth/react")
      useSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      })

      const { container } = render(<UserProfile />)
      expect(container.firstChild).toBeNull()
    })
  })
})
