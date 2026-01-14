"use client"

import { Star } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { useFavoriteModelsStore } from "@/app/(chat)/_components/providers/favorite-models-provider"
import { Button } from "@/components/ui/button"
import { useChatId } from "@/hooks/use-chat-id"
import type { Creator, Model as TModel } from "@/lib/models"
import { cn } from "@/lib/utils"
import { useSelectedModelStore } from "../../providers/selected-model-provider"
import { CreatorLogo } from "./creator-logo"

interface ModelProps {
  model: TModel
  showCreatorLogo: boolean
  closeModelPicker: () => void
}

export function Model({ model, showCreatorLogo, closeModelPicker }: ModelProps) {
  const chatId = useChatId()
  const { selectedModelId, setSelectedModelId } = useSelectedModelStore(
    useShallow((s) => ({ selectedModelId: s.modelId, setSelectedModelId: s.setModelId })),
  )
  const { isFavorited, toggleFavorite } = useFavoriteModelsStore(
    useShallow((s) => ({ isFavorited: s.favorites.includes(model.id), toggleFavorite: s.toggleFavorite })),
  )

  return (
    <Button
      key={model.id}
      size="sm"
      variant="ghost"
      className={cn(
        "group/button w-full justify-start transition-colors [&:has([data-star]:hover)]:bg-transparent",
        selectedModelId === model.id && "bg-accent text-accent-foreground dark:bg-accent/50",
      )}
      onClick={() => {
        setSelectedModelId({ chatId, modelId: model.id })
        closeModelPicker()
      }}
    >
      {showCreatorLogo && <CreatorLogo creator={model.id.split("/")[0] as Creator} className="size-3" />}
      <span className="truncate">{model.name}</span>
      {/* biome-ignore lint/a11y/useSemanticElements: avoid button-in-button */}
      <div
        data-star
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
        className="ml-auto rounded-md p-1.5 opacity-0 outline-none transition-colors hover:bg-accent focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50 group-[:hover,:focus-visible]/button:opacity-100 dark:hover:bg-accent/50"
      >
        <Star className={cn("size-3 text-muted-foreground", isFavorited && "fill-yellow-400 text-yellow-400")} />
      </div>
    </Button>
  )
}
