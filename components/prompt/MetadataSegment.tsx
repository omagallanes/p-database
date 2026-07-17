"use client"

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
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SYSTEM">System</SelectItem>
            <SelectItem value="USER">User</SelectItem>
            <SelectItem value="TOOL">Tool</SelectItem>
          </SelectContent>
        </Select>
        {errors?.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="TESTED">Tested</SelectItem>
            <SelectItem value="PRODUCTION">Production</SelectItem>
          </SelectContent>
        </Select>
        {errors?.status && <p className="mt-1 text-sm text-red-500">{errors.status}</p>}
      </div>
      <div>
        <Label htmlFor="language">Language</Label>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="catalan/valenciano">Català/Valencià</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="vasco">Euskara</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="gallego">Galego</SelectItem>
            <SelectItem value="it">Italiano</SelectItem>
            <SelectItem value="nl">Nederlands</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
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
          Mark as favorite
        </Label>
      </div>
      {errors?.isFavorite && <p className="mt-1 text-sm text-red-500">{errors.isFavorite}</p>}
    </div>
  )
}
