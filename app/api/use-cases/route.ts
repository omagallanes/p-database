import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createUseCaseSchema = z.object({
  name: z.string().min(1),
})

export async function GET() {
  try {
    const useCases = await prisma.useCase.findMany({
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

    return NextResponse.json(useCases)
  } catch (error) {
    console.error("Error fetching use-cases:", error)
    return NextResponse.json(
      { error: "Failed to fetch use-cases" },
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
    const data = createUseCaseSchema.parse(body)

    // Normalización: trim + uppercase (D-06)
    const normalizedName = data.name.trim().toUpperCase()
    const normalizedSlug = normalizedName.toLowerCase()

    // Upsert para evitar duplicados (unicidad por slug)
    const useCase = await prisma.useCase.upsert({
      where: { slug: normalizedSlug },
      update: {},
      create: {
        name: normalizedName,
        slug: normalizedSlug,
      },
    })

    return NextResponse.json({ data: useCase }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating use-case:", error)
    return NextResponse.json(
      { error: "Failed to create use-case" },
      { status: 500 }
    )
  }
}
