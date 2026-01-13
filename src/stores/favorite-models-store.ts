import { toast } from "sonner"
import { createStore } from "zustand"
import { addFavoriteModel, removeFavoriteModel } from "@/actions/chat"

type FavoriteModelsState = {
  favorites: string[]
}

type FavoriteModelsActions = {
  toggleFavorite: (modelId: string) => void
}

export type FavoriteModelsStore = FavoriteModelsState & FavoriteModelsActions

export function createFavoriteModelsStore(initialFavorites: string[]) {
  return createStore<FavoriteModelsStore>((set, get) => ({
    favorites: initialFavorites,

    toggleFavorite: async (modelId) => {
      const previousFavorites = get().favorites
      const isCurrentlyFavorite = previousFavorites.includes(modelId)

      // Optimistic update
      set({
        favorites: isCurrentlyFavorite
          ? previousFavorites.filter((id) => id !== modelId)
          : [...previousFavorites, modelId],
      })

      // Persist via server action
      const { serverError } = isCurrentlyFavorite
        ? await removeFavoriteModel({ modelId })
        : await addFavoriteModel({ modelId })

      if (serverError) {
        toast.error(serverError)
        set({ favorites: previousFavorites })
      }
    },
  }))
}
