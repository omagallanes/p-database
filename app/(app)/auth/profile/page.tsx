import { UserProfile } from "@/components/auth/UserProfile"

export const dynamic = 'force-dynamic'

export default function ProfilePage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <UserProfile />
      </div>
    </div>
  )
}
