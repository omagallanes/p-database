import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { getTranslations } from "next-intl/server"
import { getLocaleFromRequest } from "@/lib/locale"

const createClientProjectSchema = z.object({
  name: z.string().min(1),
})

export async function GET(request: NextRequest) {
  const locale = getLocaleFromRequest(request)
  const t = await getTranslations({ locale, namespace: "Api" })

  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: t("unauthorized") },
        { status: 401 }
      )
    }

    const clientProjects = await prisma.clientProject.findMany({
      include: {
        _count: {
          select: {
            prompts: {
              where: { prompt: { userId: session.user.id } },
            },
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(clientProjects)
  } catch (error) {
    console.error("Error fetching client-projects:", error)
    return NextResponse.json(
      { error: t("failedToFetchClientProjects") },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const locale = getLocaleFromRequest(request)
  const t = await getTranslations({ locale, namespace: "Api" })

  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: t("unauthorized") },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createClientProjectSchema.parse(body)

    // Normalización: trim + uppercase (D-06)
    const normalizedName = data.name.trim().toUpperCase()
    const normalizedSlug = normalizedName.toLowerCase()

    // Upsert para evitar duplicados (unicidad por slug)
    const clientProject = await prisma.clientProject.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: {
        name: normalizedName,
        slug: normalizedSlug,
      },
    })

    return NextResponse.json({ data: clientProject }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: t("invalidInput"), details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating client-project:", error)
    return NextResponse.json(
      { error: t("failedToCreateClientProject") },
      { status: 500 }
    )
  }
}
