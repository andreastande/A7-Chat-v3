"use client"

import { Star } from "lucide-react"
import { useFavoriteModelsStore } from "@/app/(sidebar)/(chat)/_components/providers/favorite-models-provider"
import { useChatId } from "@/app/(sidebar)/_hooks/use-chat-id"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import type { Creator, Model as TModel } from "@/lib/models/types"
import { cn } from "@/lib/utils"
import { useSelectedModelStore } from "../../providers/selected-model-provider"
import { CreatorLogo } from "./creator-logo"

interface ModelProps {
  model: TModel
  showCreatorLogo: boolean
  closeModelPicker: () => void
}

export function Model({ model, showCreatorLogo, closeModelPicker }: ModelProps) {
  const session = useSession()
  const chatId = useChatId()

  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const setSelectedModelId = useSelectedModelStore((s) => s.setModelId)
  const isFavorited = useFavoriteModelsStore((s) => s.favorites.includes(model.id))
  const toggleFavorite = useFavoriteModelsStore((s) => s.toggleFavorite)

  return (
    <div className="group/model relative">
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal",
          selectedModelId === model.id && "bg-muted text-foreground dark:bg-muted/50",
        )}
        onClick={() => {
          setSelectedModelId({ chatId, modelId: model.id })
          closeModelPicker()
        }}
      >
        {showCreatorLogo && <CreatorLogo creator={model.id.split("/")[0] as Creator} className="size-3" />}
        <span className="truncate group-hover/model:pr-10 group-has-focus-visible/model:pr-10">{model.name}</span>
      </Button>
      {session && (
        <div className="absolute top-1 right-1 flex gap-px">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => toggleFavorite(model.id)}
            className="size-6 opacity-0 group-hover/model:opacity-100 group-has-focus-visible/model:opacity-100"
          >
            <Star className={cn("size-3 text-muted-foreground", isFavorited && "fill-yellow-400 text-yellow-400")} />
          </Button>
        </div>
      )}
    </div>
  )
}
