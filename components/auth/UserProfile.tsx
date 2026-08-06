"use client"

import { useSession, signOut } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { DataTransferButtons } from "@/components/profile/DataTransferButtons"

export function UserProfile() {
  const { data: session, status } = useSession()
  const t = useTranslations("UserProfile")
  const tCommon = useTranslations("Common")

  if (status === "loading") {
    return <div>{tCommon("loading")}</div>
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t("title")}</h2>
        <p className="text-sm text-gray-600">{t("subtitle")}</p>
      </div>
      <div className="space-y-2">
        <div>
          <span className="text-sm font-medium">{t("name")}</span>
          <span className="ml-2 text-sm">{session.user.name}</span>
        </div>
        <div>
          <span className="text-sm font-medium">{t("email")}</span>
          <span className="ml-2 text-sm">{session.user.email}</span>
        </div>
        <div>
          <span className="text-sm font-medium">{t("role")}</span>
          <span className="ml-2 text-sm capitalize">{session.user.role}</span>
        </div>
      </div>
      <DataTransferButtons />
      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        variant="destructive"
      >
        {t("signOut")}
      </Button>
    </div>
  )
}
