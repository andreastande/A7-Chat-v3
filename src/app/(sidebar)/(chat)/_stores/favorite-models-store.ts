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

    toggleFavorite: (modelId) => {
      const isCurrentlyFavorite = get().favorites.includes(modelId)
      set({
        favorites: isCurrentlyFavorite ? get().favorites.filter((id) => id !== modelId) : [...get().favorites, modelId],
      })
      if (isCurrentlyFavorite) {
        removeFavoriteModel({ modelId }) // oxlint-disable-line
      } else {
        addFavoriteModel({ modelId }) // oxlint-disable-line
      }
    },
  }))
}
