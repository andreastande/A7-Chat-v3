"use client"

import { Star } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { useFavoriteModelsStore } from "@/components/providers/favorite-models-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Model as TModel } from "@/types"
import { ProviderLogo } from "./provider-logo"

interface ModelProps {
  model: TModel
  showProviderLogo: boolean
  closeModelPicker: () => void
}

export function Model({ model, showProviderLogo, closeModelPicker }: ModelProps) {
  const { isFavorited, toggleFavorite } = useFavoriteModelsStore(
    useShallow((s) => ({ isFavorited: s.favorites.includes(model.id), toggleFavorite: s.toggleFavorite })),
  )

  return (
    <Button
      key={model.id}
      size="sm"
      variant="ghost"
      className="group/button justify-start transition-colors"
      onClick={closeModelPicker}
    >
      {showProviderLogo && <ProviderLogo provider={model.owned_by} className="size-3.5" />}
      <span className="truncate">{model.name}</span>
      {/* biome-ignore lint/a11y/useSemanticElements: avoid button-in-button */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(model.id)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation()
            toggleFavorite(model.id)
          }
        }}
        className="ml-auto rounded p-1 opacity-0 outline-none transition-colors hover:bg-border focus-visible:ring-2 focus-visible:ring-ring/50 group-hover/button:opacity-100"
      >
        <Star className={cn("size-3.5 text-muted-foreground", isFavorited && "fill-yellow-400 text-yellow-400")} />
      </div>
    </Button>
  )
}
