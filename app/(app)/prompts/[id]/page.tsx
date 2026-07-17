import { PromptForm } from "@/components/prompt/PromptForm"
import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

async function getPrompt(id: string) {
  const prompt = await prisma.prompt.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
      platforms: {
        include: {
          platform: true,
        },
      },
      clientProjects: {
        include: {
          clientProject: true,
        },
      },
      useCases: {
        include: {
          useCase: true,
        },
      },
      modelHints: {
        include: {
          modelHint: true,
        },
      },
    },
  })

  return prompt
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    include: {
      parent: true,
    },
    orderBy: [
      { sortOrder: "asc" },
      { name: "asc" },
    ],
  })

  return categories
}

async function getTags() {
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return tags
}

async function getPlatforms() {
  const platforms = await prisma.platform.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return platforms
}

async function getClientProjects() {
  const clientProjects = await prisma.clientProject.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return clientProjects
}

async function getUseCases() {
  const useCases = await prisma.useCase.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return useCases
}

async function getModelHints() {
  const modelHints = await prisma.modelHint.findMany({
    orderBy: {
      name: "asc",
    },
  })

  return modelHints
}

export default async function PromptDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const [prompt, categories, tags, platforms, clientProjects, useCases, modelHints] = await Promise.all([
    getPrompt(params.id),
    getCategories(),
    getTags(),
    getPlatforms(),
    getClientProjects(),
    getUseCases(),
    getModelHints(),
  ])

  if (!prompt) {
    notFound()
  }

  // Serialize dates to ISO strings for client component
  const serializedPrompt = {
    ...prompt,
    createdAt: prompt.createdAt.toISOString(),
    updatedAt: prompt.updatedAt.toISOString(),
  }

  return <PromptForm prompt={serializedPrompt} categories={categories} tags={tags} platforms={platforms} clientProjects={clientProjects} useCases={useCases} modelHints={modelHints} />
}
