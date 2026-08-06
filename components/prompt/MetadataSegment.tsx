"use client"

import { useTranslations } from "next-intl"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MetadataSegmentProps {
  type: string
  status: string
  language: string
  isFavorite: boolean
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onFavoriteChange: (value: boolean) => void
  errors?: Record<string, string | undefined>
}

export default function MetadataSegment({
  type,
  status,
  language,
  isFavorite,
  onTypeChange,
  onStatusChange,
  onLanguageChange,
  onFavoriteChange,
  errors,
}: MetadataSegmentProps) {
  const t = useTranslations("MetadataSegment")

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">{t("type")}</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SYSTEM">{t("system")}</SelectItem>
            <SelectItem value="USER">{t("user")}</SelectItem>
            <SelectItem value="TOOL">{t("tool")}</SelectItem>
          </SelectContent>
        </Select>
        {errors?.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>
      <div>
        <Label htmlFor="status">{t("status")}</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">{t("draft")}</SelectItem>
            <SelectItem value="TESTED">{t("tested")}</SelectItem>
            <SelectItem value="PRODUCTION">{t("production")}</SelectItem>
          </SelectContent>
        </Select>
        {errors?.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
      </div>
      <div>
        <Label htmlFor="language">{t("language")}</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="catalan/valenciano">{t("languageCatalan")}</SelectItem>
            <SelectItem value="de">{t("languageDeutsch")}</SelectItem>
            <SelectItem value="en">{t("languageEnglish")}</SelectItem>
            <SelectItem value="es">{t("languageSpanish")}</SelectItem>
            <SelectItem value="vasco">{t("languageEuskara")}</SelectItem>
            <SelectItem value="fr">{t("languageFrench")}</SelectItem>
            <SelectItem value="gallego">{t("languageGalician")}</SelectItem>
            <SelectItem value="it">{t("languageItalian")}</SelectItem>
            <SelectItem value="nl">{t("languageDutch")}</SelectItem>
            <SelectItem value="pt">{t("languagePortuguese")}</SelectItem>
          </SelectContent>
        </Select>
        {errors?.language && <p className="mt-1 text-sm text-red-500">{errors.language}</p>}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isFavorite"
          checked={isFavorite}
          onChange={(e) => onFavoriteChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="isFavorite" className="cursor-pointer">
          {t("markAsFavorite")}
        </Label>
      </div>
      {errors?.isFavorite && <p className="mt-1 text-sm text-red-500">{errors.isFavorite}</p>}
    </div>
  )
}
