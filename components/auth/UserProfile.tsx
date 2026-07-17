"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium">Name:</span>
          <span className="ml-2 text-sm">{session.user.name}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Email:</span>
          <span className="ml-2 text-sm">{session.user.email}</span>
        </div>
        <div>
          <span className="text-sm font-medium">Role:</span>
          <span className="ml-2 text-sm capitalize">{session.user.role}</span>
        </div>
      </div>
      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        variant="destructive"
      >
        Sign Out
      </Button>
    </div>
  )
}
