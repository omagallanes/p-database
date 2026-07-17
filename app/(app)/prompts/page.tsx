import { PromptList } from "@/components/prompt/PromptList"
import { PromptFilters } from "@/components/prompt/PromptFilters"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"
import { auth } from "@/lib/auth"
import { ViewToggle } from "@/components/prompt/ViewToggle"
import { ViewModeProvider } from "@/contexts/ViewModeContext"

export const dynamic = 'force-dynamic'

interface TransformedPrompt {
  id: string
  title: string
  description: string | null
  body: string
  type: string
  platform: string
  modelHint: string | null
  language: string
  useCase: string | null
  clientOrProject: string | null
  status: string
  isFavorite: boolean
  version: number
  changelog: string | null
  notes: string | null
  usageCount: number
  lastUsedAt: string | null
  category: null
  categories: { category: { id: string; name: string; slug: string } }[]
  tags: { tag: { id: string; name: string; slug: string } }[]
  platforms: { platform: { id: string; name: string; slug: string } }[]
  clientProjects: { clientProject: { id: string; name: string; slug: string } }[]
  user: { name: string; email: string } | null
  createdAt: string
  updatedAt: string
}

async function getPrompts(searchParams: {
  search?: string
  categoryId?: string
  categoryIds?: string[]
  tagIds?: string[]
  platform?: string
  platformIds?: string[]
  status?: string | string[]
  isFavorite?: string
  language?: string | string[]
  clientProjectIds?: string[]
  useCaseIds?: string[]
}) {
  const where: Prisma.PromptWhereInput = {}

  if (searchParams.search) {
    const searchWords = searchParams.search.trim().split(/\s+/).filter((word) => word.length > 0)

    if (searchWords.length > 0) {
      where.AND = searchWords.map((word) => ({
        OR: [
          { title: { contains: word, mode: "insensitive" } },
          { description: { contains: word, mode: "insensitive" } },
          { body: { contains: word, mode: "insensitive" } },
          { prePrompt: { contains: word, mode: "insensitive" } },
          { manualDeUso: { contains: word, mode: "insensitive" } },
        ],
      }))
    }
  }

  // Build AND conditions for N:M filters (each selected value must match)
  const andConditions: Prisma.PromptWhereInput[] = []

  if (searchParams.categoryIds && searchParams.categoryIds.length > 0) {
    for (const catId of searchParams.categoryIds) {
      andConditions.push({
        categories: { some: { categoryId: catId } },
      })
    }
  } else if (searchParams.categoryId) {
    andConditions.push({
      categories: { some: { categoryId: searchParams.categoryId } },
    })
  }

  if (searchParams.platformIds && searchParams.platformIds.length > 0) {
    for (const platId of searchParams.platformIds) {
      andConditions.push({
        platforms: { some: { platformId: platId } },
      })
    }
  } else if (searchParams.platform) {
    where.platform = searchParams.platform
  }

  if (searchParams.tagIds && searchParams.tagIds.length > 0) {
    for (const tagId of searchParams.tagIds) {
      andConditions.push({
        tags: { some: { tagId: tagId } },
      })
    }
  }

  if (searchParams.clientProjectIds && searchParams.clientProjectIds.length > 0) {
    for (const cpId of searchParams.clientProjectIds) {
      andConditions.push({
        clientProjects: { some: { clientProjectId: cpId } },
      })
    }
  }

  if (searchParams.useCaseIds && searchParams.useCaseIds.length > 0) {
    for (const ucId of searchParams.useCaseIds) {
      andConditions.push({
        useCases: { some: { useCaseId: ucId } },
      })
    }
  }

  // Merge AND conditions with existing search where.AND
  if (andConditions.length > 0) {
    if (where.AND) {
      where.AND = [...(Array.isArray(where.AND) ? where.AND : [where.AND]), ...andConditions]
    } else {
      where.AND = andConditions
    }
  }

  if (searchParams.status) {
    const statuses = Array.isArray(searchParams.status) ? searchParams.status : [searchParams.status]
    if (statuses.length > 0) {
      where.status = {
        in: statuses,
      }
    }
  }

  if (searchParams.isFavorite !== undefined && searchParams.isFavorite !== null) {
    where.isFavorite = searchParams.isFavorite === "true"
  }

  if (searchParams.language) {
    const languages = Array.isArray(searchParams.language) ? searchParams.language : [searchParams.language]
    if (languages.length > 0) {
      where.language = {
        in: languages,
      }
    }
  }

    const prompts = await prisma.prompt.findMany({
      where,
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
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    const transformedPrompts = prompts.map((prompt) => {
      const result: TransformedPrompt = {
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        body: prompt.body,
        type: prompt.type,
        platform: prompt.platform ?? "",
        modelHint: prompt.modelHint,
        language: prompt.language,
        useCase: prompt.useCase,
        clientOrProject: prompt.clientOrProject,
        status: prompt.status,
        isFavorite: prompt.isFavorite,
        version: prompt.version,
        changelog: prompt.changelog,
        notes: prompt.notes,
        usageCount: prompt.usageCount,
        lastUsedAt: prompt.lastUsedAt ? prompt.lastUsedAt.toISOString() : null,
        category: null,
        categories: prompt.categories.map((pc) => ({
          category: {
            id: pc.category.id,
            name: pc.category.name,
            slug: pc.category.slug,
          },
        })),
        tags: prompt.tags.map((pt) => ({
          tag: {
            id: pt.tag.id,
            name: pt.tag.name,
            slug: pt.tag.slug,
          },
        })),
        platforms: prompt.platforms.map((pp) => ({
          platform: {
            id: pp.platform.id,
            name: pp.platform.name,
            slug: pp.platform.slug,
          },
        })),
        clientProjects: prompt.clientProjects.map((cp) => ({
          clientProject: {
            id: cp.clientProject.id,
            name: cp.clientProject.name,
            slug: cp.clientProject.slug,
          },
        })),
        user: null,
        createdAt: prompt.createdAt.toISOString(),
        updatedAt: prompt.updatedAt.toISOString(),
      }
      return result
    })

    return { items: transformedPrompts, total: transformedPrompts.length }
}

async function getCategories() {
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

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    parentId: cat.parentId,
    sortOrder: cat.sortOrder,
    parent: cat.parent ? {
      id: cat.parent.id,
      name: cat.parent.name,
      slug: cat.parent.slug,
      parentId: cat.parent.parentId,
      sortOrder: cat.parent.sortOrder,
    } : null,
    children: cat.children.map((child) => ({
      id: child.id,
      name: child.name,
      slug: child.slug,
      parentId: child.parentId,
      sortOrder: child.sortOrder,
    })),
    _count: cat._count,
  }))
}

async function getTags() {
  const tags = await prisma.tag.findMany({
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

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    slug: tag.slug,
    _count: tag._count,
  }))
}

async function getPlatforms() {
  const platforms = await prisma.platform.findMany({
    orderBy: { name: "asc" },
  })

  return platforms.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
  }))
}

async function getClientProjects() {
  const clientProjects = await prisma.clientProject.findMany({
    orderBy: { name: "asc" },
  })

  return clientProjects.map((cp) => ({
    id: cp.id,
    name: cp.name,
    slug: cp.slug,
  }))
}

async function getUseCases() {
  const useCases = await prisma.useCase.findMany({
    orderBy: { name: "asc" },
  })

  return useCases.map((uc) => ({
    id: uc.id,
    name: uc.name,
    slug: uc.slug,
  }))
}

async function getUserViewPreference(userId?: string): Promise<"cards" | "list"> {
  if (!userId) return "cards"
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      promptListViewPreference: true,
    },
  })
  
  return (user?.promptListViewPreference as "cards" | "list") || "cards"
}

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: {
    search?: string
    categoryId?: string
    categoryIds?: string | string[]
    tagIds?: string | string[]
    platform?: string
    platformIds?: string | string[]
    status?: string | string[]
    isFavorite?: string
    language?: string | string[]
    clientProjectIds?: string | string[]
    useCaseIds?: string | string[]
  }
}) {
  const session = await auth()
  const userId = session?.user?.id
  
  const tagIds = Array.isArray(searchParams.tagIds)
    ? searchParams.tagIds
    : searchParams.tagIds
    ? [searchParams.tagIds]
    : []

  const categoryIds = Array.isArray(searchParams.categoryIds)
    ? searchParams.categoryIds
    : searchParams.categoryIds
    ? [searchParams.categoryIds]
    : []

  const platformIds = Array.isArray(searchParams.platformIds)
    ? searchParams.platformIds
    : searchParams.platformIds
    ? [searchParams.platformIds]
    : []

  const clientProjectIds = Array.isArray(searchParams.clientProjectIds)
    ? searchParams.clientProjectIds
    : searchParams.clientProjectIds
    ? [searchParams.clientProjectIds]
    : []

  const useCaseIds = Array.isArray(searchParams.useCaseIds)
    ? searchParams.useCaseIds
    : searchParams.useCaseIds
    ? [searchParams.useCaseIds]
    : []

  const status = Array.isArray(searchParams.status)
    ? searchParams.status
    : searchParams.status
    ? [searchParams.status]
    : []

  const language = Array.isArray(searchParams.language)
    ? searchParams.language
    : searchParams.language
    ? [searchParams.language]
    : []

  const [prompts, categories, tags, platforms, clients, useCases, viewMode] = await Promise.all([
    getPrompts({ ...searchParams, tagIds, categoryIds, platformIds, clientProjectIds, useCaseIds }),
    getCategories(),
    getTags(),
    getPlatforms(),
    getClientProjects(),
    getUseCases(),
    getUserViewPreference(userId),
  ])

  return (
    <ViewModeProvider initialViewMode={viewMode}>
      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <PromptFilters
            categories={categories}
            tags={tags}
            platforms={platforms}
            clients={clients}
            useCases={useCases}
            initialFilters={{ ...searchParams, categoryIds, platformIds, clientProjectIds, useCaseIds, status, language }}
          />
        </div>
        <div className="flex-1">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Prompts
              </h1>
              <ViewToggle />
            </div>
            <p className="text-gray-600 font-medium">
              {prompts.total} prompt{prompts.total !== 1 ? "s" : ""} found
            </p>
          </div>
          <PromptList prompts={prompts.items} />
        </div>
      </div>
    </ViewModeProvider>
  )
}
