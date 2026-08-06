import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { getTranslations } from "next-intl/server"
import { getLocaleFromRequest } from "@/lib/locale"

// DELETE /api/users/[id] - Delete user (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const locale = getLocaleFromRequest(request)
  const t = await getTranslations({ locale, namespace: "Api" })

  try {
    const session = await auth()
    
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: t("unauthorized") },
        { status: 401 }
      )
    }

    // Prevent deleting yourself
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: t("cannotDeleteOwnAccount") },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ data: { message: t("userDeleted") } })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json(
      { error: t("internalServerError") },
      { status: 500 }
    )
  }
}
