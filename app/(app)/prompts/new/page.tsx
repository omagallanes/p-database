import { PromptForm } from "@/components/prompt/PromptForm"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

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

export default async function NewPromptPage() {
  const [categories, tags, platforms, clientProjects, useCases, modelHints] = await Promise.all([
    getCategories(),
    getTags(),
    getPlatforms(),
    getClientProjects(),
    getUseCases(),
    getModelHints(),
  ])

  return <PromptForm categories={categories} tags={tags} platforms={platforms} clientProjects={clientProjects} useCases={useCases} modelHints={modelHints} />
}
