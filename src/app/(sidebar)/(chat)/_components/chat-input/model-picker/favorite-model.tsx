"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Star } from "lucide-react"
import { useFavoriteModelsStore } from "@/app/(sidebar)/(chat)/_components/providers/favorite-models-provider"
import { useChatId } from "@/app/(sidebar)/_hooks/use-chat-id"
import { Button } from "@/components/ui/button"
import type { Creator, Model as TModel } from "@/lib/models/types"
import { cn } from "@/lib/utils"
import { useSelectedModelStore } from "../../providers/selected-model-provider"
import { CreatorLogo } from "./creator-logo"

interface FavoriteModelProps {
  model: TModel
  isDraggingAny: boolean
  closeModelPicker: () => void
}

export function FavoriteModel({ model, isDraggingAny, closeModelPicker }: FavoriteModelProps) {
  const chatId = useChatId()

  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const setSelectedModelId = useSelectedModelStore((s) => s.setModelId)
  const toggleFavorite = useFavoriteModelsStore((s) => s.toggleFavorite)

  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
    id: model.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/model relative",
        isDragging && "opacity-60 **:cursor-grabbing",
        isDraggingAny && !isDragging && "pointer-events-none",
      )}
    >
      <Button
        size="sm"
        variant="ghost"
        className={cn(
          "w-full justify-start font-normal",
          (selectedModelId === model.id || isDragging) && "bg-muted text-foreground dark:bg-muted/50",
        )}
        onClick={() => {
          setSelectedModelId({ chatId, modelId: model.id })
          closeModelPicker()
        }}
      >
        <CreatorLogo creator={model.id.split("/")[0] as Creator} className="size-3" />
        <span className="truncate group-hover/model:pr-14 group-has-focus-visible/model:pr-14">{model.name}</span>
      </Button>
      <div className="absolute top-1 right-1 flex gap-px">
        <Button
          ref={setActivatorNodeRef}
          variant="ghost"
          size="icon-xs"
          className={cn(
            "size-6 cursor-grab opacity-0 group-hover/model:opacity-100 group-has-focus-visible/model:opacity-100 active:cursor-grabbing",
            isDragging && "opacity-100",
          )}
          {...listeners}
          {...attributes}
        >
          <GripVertical className="size-3 text-muted-foreground" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => toggleFavorite(model.id)}
          className={cn(
            "size-6 opacity-0 group-hover/model:opacity-100 group-has-focus-visible/model:opacity-100",
            isDragging && "opacity-100",
          )}
        >
          <Star className="size-3 fill-yellow-400 text-yellow-400" />
        </Button>
      </div>
    </li>
  )
}
