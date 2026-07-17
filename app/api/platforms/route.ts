import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createPlatformSchema = z.object({
  name: z.string().min(1),
})

export async function GET() {
  try {
    const platforms = await prisma.platform.findMany({
      include: {
        _count: {
          select: {
            prompts: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(platforms)
  } catch (error) {
    console.error("Error fetching platforms:", error)
    return NextResponse.json(
      { error: "Failed to fetch platforms" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createPlatformSchema.parse(body)

    // Normalización: trim + uppercase (D-06)
    const normalizedName = data.name.trim().toUpperCase()
    const normalizedSlug = normalizedName.toLowerCase()

    // Upsert para evitar duplicados (unicidad por slug)
    const platform = await prisma.platform.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: {
        name: normalizedName,
        slug: normalizedSlug,
      },
    })

    return NextResponse.json({ data: platform }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating platform:", error)
    return NextResponse.json(
      { error: "Failed to create platform" },
      { status: 500 }
    )
  }
}
