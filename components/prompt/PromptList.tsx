"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Copy, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useViewMode } from "@/contexts/ViewModeContext"

interface Prompt {
  id: string
  title: string
  description: string | null
  body: string
  platform: string
  status: string
  isFavorite: boolean
  lastUsedAt: string | null
  usageCount: number
  category: {
    name: string
  } | null
  tags: {
    tag: {
      name: string
    }
  }[]
  platforms: {
    platform: {
      name: string
    }
  }[]
  categories: {
    category: {
      name: string
    }
  }[]
  clientProjects: {
    clientProject: {
      name: string
    }
  }[]
  user: {
    name: string
    email: string
  } | null
}

interface PromptListProps {
  prompts: Prompt[]
}

export function PromptList({ prompts }: PromptListProps) {
  const { viewMode } = useViewMode()
  const t = useTranslations("PromptList")
  const tCommon = useTranslations("Common")
  const handleCopy = async (body: string, id: string) => {
    try {
      await navigator.clipboard.writeText(body)
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
      await fetch(`${basePath}/api/prompts/${id}/usage`, { method: "PATCH" })
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">{t("noPromptsFound")}</p>
        <Link href="/prompts/new" className="mt-4">
          <Button>{t("createFirstPrompt")}</Button>
        </Link>
      </div>
    )
  }

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      CHATGPT: "bg-green-100 text-green-700 border-green-300",
      CURSOR: "bg-purple-100 text-purple-700 border-purple-300",
      MIDJOURNEY: "bg-pink-100 text-pink-700 border-pink-300",
      SUNO: "bg-orange-100 text-orange-700 border-orange-300",
      OTHER: "bg-gray-100 text-gray-700 border-gray-300",
    }
    return colors[platform] || colors.OTHER
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PRODUCTION: "bg-emerald-100 text-emerald-700 border-emerald-300",
      TESTED: "bg-blue-100 text-blue-700 border-blue-300",
      DRAFT: "bg-amber-100 text-amber-700 border-amber-300",
    }
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-300"
  }

  // List view - table format
  if (viewMode === "list") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colCopy")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colEdit")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colTitle")}</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-700">★</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colStatus")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colPlatforms")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colCategories")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colTags")}</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">{t("colClientProject")}</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt) => (
              <tr key={prompt.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(prompt.body, prompt.id)}
                    className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </td>
                <td className="py-3 px-4">
                  <Link href={`/prompts/${prompt.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium text-gray-800">{prompt.title}</span>
                </td>
                <td className="py-3 px-4 text-center">
                  {prompt.isFavorite && (
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 inline" />
                  )}
                </td>
                <td className="py-3 px-4">
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(prompt.status)} font-medium border`}
                  >
                    {prompt.status}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {prompt.platforms.length > 0 ? (
                      prompt.platforms.map((pp) => (
                        <Badge
                          key={pp.platform.name}
                          variant="outline"
                          className={`${getPlatformColor(pp.platform.name)} font-medium border text-xs`}
                        >
                          {pp.platform.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">{prompt.platform}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {prompt.categories.map((pc) => (
                      <Badge
                        key={pc.category.name}
                        variant="secondary"
                        className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                      >
                        {pc.category.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.map((pt) => (
                      <Badge
                        key={pt.tag.name}
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                      >
                        {pt.tag.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1">
                    {prompt.clientProjects.length > 0 ? (
                      prompt.clientProjects.map((cp) => (
                        <Badge
                          key={cp.clientProject.name}
                          variant="outline"
                          className="bg-gray-100 text-gray-700 border-gray-300 text-xs"
                        >
                          {cp.clientProject.name}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  // Cards view - existing grid layout
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <Card 
          key={prompt.id} 
          className="flex flex-col gradient-card shadow-glow hover:shadow-glow-hover transition-all duration-300 border-purple-100 overflow-hidden group"
        >
          <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"></div>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="flex-1 text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                {prompt.title}
              </CardTitle>
              {prompt.isFavorite && (
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              )}
            </div>
            {prompt.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {prompt.description}
              </p>
            )}
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              {prompt.platforms && prompt.platforms.length > 0 ? (
                prompt.platforms.map((pp) => (
                  <Badge
                    key={pp.platform.name}
                    variant="outline"
                    className={`${getPlatformColor(pp.platform.name)} font-medium border`}
                  >
                    {pp.platform.name}
                  </Badge>
                ))
              ) : (
                <Badge 
                  variant="outline" 
                  className={`${getPlatformColor(prompt.platform)} font-medium border`}
                >
                  {prompt.platform}
                </Badge>
              )}
              <Badge
                variant="outline"
                className={`${getStatusColor(prompt.status)} font-medium border`}
              >
                {prompt.status}
              </Badge>
              {prompt.categories && prompt.categories.map((pc) => (
                <Badge key={pc.category.name} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                  {pc.category.name}
                </Badge>
              ))}
            </div>

            {prompt.tags && prompt.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {prompt.tags.map((pt) => (
                  <Badge 
                    key={pt.tag.name} 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                  >
                    {pt.tag.name}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1">
                <span className="font-medium text-gray-700">{prompt.usageCount}</span>
                <span>{t("uses", { count: prompt.usageCount })}</span>
                {prompt.lastUsedAt && (
                  <>
                    <span>•</span>
                    <span>{new Date(prompt.lastUsedAt).toLocaleDateString()}</span>
                  </>
                )}
              </span>
              {prompt.user && (
                <span className="text-xs text-gray-400">
                  {t("byUser", { name: prompt.user.name })}
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => handleCopy(prompt.body, prompt.id)}
                className="flex-1 border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
              >
                <Copy className="mr-2 h-4 w-4" />
                {tCommon("copy")}
              </Button>
              <Link href={`/prompts/${prompt.id}`} className="flex-1">
                <Button 
                  variant="outline" 
                  className="w-full border-purple-200 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {tCommon("edit")}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
