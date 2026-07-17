import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { z } from "zod"

const updatePreferencesSchema = z.object({
  promptListViewPreference: z.enum(["cards", "list"]),
})

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = updatePreferencesSchema.parse(body)

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        promptListViewPreference: data.promptListViewPreference,
      },
      select: {
        promptListViewPreference: true,
      },
    })

    return NextResponse.json({ data: user })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      )
    }
    console.error("Error updating preferences:", error)
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { data: { promptListViewPreference: "cards" } }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        promptListViewPreference: true,
      },
    })

    return NextResponse.json({ 
      data: { 
        promptListViewPreference: user?.promptListViewPreference || "cards" 
      } 
    })
  } catch (error) {
    console.error("Error fetching preferences:", error)
    return NextResponse.json(
      { error: "Failed to fetch preferences" },
      { status: 500 }
    )
  }
}
