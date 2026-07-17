"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface PromptFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>
  tags: Array<{ id: string; name: string; slug: string }>
  platforms: Array<{ id: string; name: string; slug: string }>
  clients: Array<{ id: string; name: string; slug: string }>
  useCases: Array<{ id: string; name: string; slug: string }>
  initialFilters: {
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
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "ru", name: "Russian" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese" },
  { code: "ko", name: "Korean" },
]

const STATUSES = [
  { value: "DRAFT", label: "Draft" },
  { value: "TESTED", label: "Tested" },
  { value: "PRODUCTION", label: "Production" },
]

export function PromptFilters({
  categories,
  tags,
  platforms,
  clients,
  useCases,
  initialFilters,
}: PromptFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/prompts?${params.toString()}`)
  }

  const toggleFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentValues = params.getAll(key)
    if (currentValues.includes(value)) {
      params.delete(key)
      currentValues
        .filter((v) => v !== value)
        .forEach((v) => params.append(key, v))
    } else {
      params.append(key, value)
    }
    router.push(`/prompts?${params.toString()}`)
  }, [searchParams, router])

  const clearFilters = () => {
    router.push("/prompts")
  }

  const selectedTagIds = Array.isArray(initialFilters.tagIds)
    ? initialFilters.tagIds
    : initialFilters.tagIds
    ? [initialFilters.tagIds]
    : []

  const selectedPlatformIds = Array.isArray(initialFilters.platformIds)
    ? initialFilters.platformIds
    : initialFilters.platformIds
    ? [initialFilters.platformIds]
    : []

  const selectedCategoryIds = Array.isArray(initialFilters.categoryIds)
    ? initialFilters.categoryIds
    : initialFilters.categoryIds
    ? [initialFilters.categoryIds]
    : []

  const selectedStatuses = Array.isArray(initialFilters.status)
    ? initialFilters.status
    : initialFilters.status
    ? [initialFilters.status]
    : []

  const selectedLanguages = Array.isArray(initialFilters.language)
    ? initialFilters.language
    : initialFilters.language
    ? [initialFilters.language]
    : []

  const selectedClientProjectIds = Array.isArray(initialFilters.clientProjectIds)
    ? initialFilters.clientProjectIds
    : initialFilters.clientProjectIds
    ? [initialFilters.clientProjectIds]
    : []

  const selectedUseCaseIds = Array.isArray(initialFilters.useCaseIds)
    ? initialFilters.useCaseIds
    : initialFilters.useCaseIds
    ? [initialFilters.useCaseIds]
    : []

  const selectedArrays: Record<string, string[]> = useMemo(
    () => ({
      categoryIds: selectedCategoryIds,
      tagIds: selectedTagIds,
      platformIds: selectedPlatformIds,
      status: selectedStatuses,
      language: selectedLanguages,
      clientProjectIds: selectedClientProjectIds,
      useCaseIds: selectedUseCaseIds,
    }),
    [
      selectedCategoryIds,
      selectedTagIds,
      selectedPlatformIds,
      selectedStatuses,
      selectedLanguages,
      selectedClientProjectIds,
      selectedUseCaseIds,
    ],
  )

  const isSelected = useCallback(
    (key: string, value: string): boolean => {
      return selectedArrays[key]?.includes(value) ?? false
    },
    [selectedArrays],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
        {(initialFilters.categoryId ||
          selectedCategoryIds.length > 0 ||
          selectedPlatformIds.length > 0 ||
          selectedTagIds.length > 0 ||
          initialFilters.platform ||
          selectedStatuses.length > 0 ||
          selectedLanguages.length > 0 ||
          selectedClientProjectIds.length > 0 ||
          selectedUseCaseIds.length > 0 ||
          initialFilters.isFavorite) && (
          <Button variant="ghost" size="sm" onClick={clearFilters} aria-label="Clear filters" className="hover:bg-purple-50 hover:text-purple-700">
            <X className="h-4 w-4" />
            <span className="sr-only">Clear filters</span>
          </Button>
        )}
      </div>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Favorite</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center space-x-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={initialFilters.isFavorite === "true"}
              onChange={(e) =>
                updateFilter("isFavorite", e.target.checked ? "true" : null)
              }
              className="h-4 w-4 rounded border-purple-300 text-purple-600 focus:ring-purple-400 focus:ring-2 cursor-pointer"
            />
            <span className="text-sm text-gray-700 group-hover:text-purple-700">Show favorites only</span>
          </label>
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => {
            return (
              <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("categoryIds", category.id)}
                  onChange={() => toggleFilter("categoryIds", category.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {tags.map((tag) => {
            return (
              <label
                key={tag.id}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isSelected("tagIds", tag.id)}
                  onChange={() => toggleFilter("tagIds", tag.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{tag.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Platform</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {platforms.map((platform) => {
            return (
              <label key={platform.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("platformIds", platform.id)}
                  onChange={() => toggleFilter("platformIds", platform.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{platform.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {STATUSES.map((statusOption) => {
            return (
              <label key={statusOption.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("status", statusOption.value)}
                  onChange={() => toggleFilter("status", statusOption.value)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{statusOption.label}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Language</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {LANGUAGES.map((languageOption) => {
            return (
              <label key={languageOption.code} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("language", languageOption.code)}
                  onChange={() => toggleFilter("language", languageOption.code)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{languageOption.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Client / Project</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {clients.map((client) => {
            return (
              <label key={client.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("clientProjectIds", client.id)}
                  onChange={() => toggleFilter("clientProjectIds", client.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{client.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>

      <Card className="gradient-card shadow-glow border-purple-100">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700">Use Case</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {useCases.map((useCase) => {
            return (
              <label key={useCase.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSelected("useCaseIds", useCase.id)}
                  onChange={() => toggleFilter("useCaseIds", useCase.id)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className="text-sm">{useCase.name}</span>
              </label>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
