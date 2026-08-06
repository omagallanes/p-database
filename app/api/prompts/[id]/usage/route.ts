import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getTranslations } from "next-intl/server"
import { getLocaleFromRequest } from "@/lib/locale"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const locale = getLocaleFromRequest(request)
  const t = await getTranslations({ locale, namespace: "Api" })

  try {
    const prompt = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        usageCount: {
          increment: 1,
        },
        lastUsedAt: new Date(),
      },
      include: {
        categories: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    })

    return NextResponse.json(prompt)
  } catch (error) {
    console.error("Error updating prompt usage:", error)
    return NextResponse.json(
      { error: t("failedToUpdatePromptUsage") },
      { status: 500 }
    )
  }
}


