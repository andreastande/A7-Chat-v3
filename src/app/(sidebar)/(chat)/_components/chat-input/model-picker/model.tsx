"use client"

import { Star } from "lucide-react"
import { useShallow } from "zustand/react/shallow"
import { useFavoriteModelsStore } from "@/app/(sidebar)/(chat)/_components/providers/favorite-models-provider"
import { useSession } from "@/components/providers/session-provider"
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
  const session = useSession()
  const chatId = useChatId()
  const { selectedModelId, setSelectedModelId } = useSelectedModelStore(
    useShallow((s) => ({ selectedModelId: s.modelId, setSelectedModelId: s.setModelId })),
  )
  const { isFavorited, toggleFavorite } = useFavoriteModelsStore(
    useShallow((s) => ({ isFavorited: s.favorites.includes(model.id), toggleFavorite: s.toggleFavorite })),
  )

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "peer/button w-full justify-start font-normal",
          selectedModelId === model.id && "bg-muted text-foreground dark:bg-muted/50",
        )}
        onClick={() => {
          setSelectedModelId({ chatId, modelId: model.id })
          closeModelPicker()
        }}
      >
        {showCreatorLogo && <CreatorLogo creator={model.id.split("/")[0] as Creator} className="size-3" />}
        <span className="truncate">{model.name}</span>
      </Button>
      {session && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => toggleFavorite(model.id)}
          className="absolute top-1 right-1 size-6 opacity-0 peer-[:hover,:focus-visible]/button:opacity-100 [:hover,:focus-visible]:opacity-100"
        >
          <Star className={cn("size-3 text-muted-foreground", isFavorited && "fill-yellow-400 text-yellow-400")} />
        </Button>
      )}
    </div>
  )
}
