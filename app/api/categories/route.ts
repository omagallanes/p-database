import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.string().optional(),
  sortOrder: z.number().default(0),
})

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            prompts: true,
          },
        },
      },
      orderBy: [
        { sortOrder: "asc" },
        { name: "asc" },
      ],
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      { error: "Failed to fetch categories" },
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
    const data = createCategorySchema.parse(body)

    // Validate depth: parent must be a level-1 category (no parent itself)
    if (data.parentId) {
      const parentCategory = await prisma.category.findUnique({
        where: { id: data.parentId },
        select: { parentId: true },
      })
      if (!parentCategory) {
        return NextResponse.json(
          { error: "Parent category not found" },
          { status: 400 }
        )
      }
      if (parentCategory.parentId !== null) {
        return NextResponse.json(
          { error: "Cannot nest categories deeper than 2 levels. Select a top-level category as parent." },
          { status: 400 }
        )
      }
    }

    // Convert null parentId to undefined (don't include in data)
    const createData: {
      name: string
      slug: string
      parentId?: string
      sortOrder: number
    } = {
      name: data.name,
      slug: data.slug,
      sortOrder: data.sortOrder,
    }

    if (data.parentId) {
      createData.parentId = data.parentId
    }

    const category = await prisma.category.create({
      data: createData,
    })

    return NextResponse.json({ data: category }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error creating category:", error)
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    )
  }
}


