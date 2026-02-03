"use client"

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToFirstScrollableAncestor, restrictToVerticalAxis } from "@dnd-kit/modifiers"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useState } from "react"
import { useFavoriteModelsStore } from "@/app/(sidebar)/(chat)/_components/providers/favorite-models-provider"
import type { Model } from "@/lib/models"
import { FavoriteModel } from "./favorite-model"

interface FavoriteModelsListProps {
  favorites: string[]
  models: Model[]
  closeModelPicker: () => void
}

export function FavoriteModelsList({ favorites, models, closeModelPicker }: FavoriteModelsListProps) {
  const reorderFavorites = useFavoriteModelsStore((s) => s.reorderFavorites)
  const [isDragging, setIsDragging] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function handleDragStart() {
    setIsDragging(true)
  }

  function handleDragEnd(event: DragEndEvent) {
    setIsDragging(false)
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = favorites.indexOf(active.id as string)
      const newIndex = favorites.indexOf(over.id as string)
      const newOrder = arrayMove(favorites, oldIndex, newIndex)
      reorderFavorites(newOrder)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={favorites} strategy={verticalListSortingStrategy}>
        <ul tabIndex={-1} className="flex flex-1 flex-col space-y-1 overflow-y-auto p-1">
          {models.map((model) => (
            <FavoriteModel
              key={model.id}
              model={model}
              isDraggingAny={isDragging}
              closeModelPicker={closeModelPicker}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
