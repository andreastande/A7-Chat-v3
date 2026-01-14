"use client"

import { createContext, type ReactNode, useContext, useState } from "react"
import { useStore } from "zustand"
import { createFavoriteModelsStore, type FavoriteModelsStore } from "@/stores/favorite-models-store"

type FavoriteModelsStoreApi = ReturnType<typeof createFavoriteModelsStore>

const FavoriteModelsContext = createContext<FavoriteModelsStoreApi | null>(null)

export function FavoriteModelsProvider({
  children,
  initialFavorites,
}: {
  children: ReactNode
  initialFavorites: string[]
}) {
  const [store] = useState(() => createFavoriteModelsStore(initialFavorites))
  return <FavoriteModelsContext.Provider value={store}>{children}</FavoriteModelsContext.Provider>
}

export function useFavoriteModelsStore<T>(selector: (state: FavoriteModelsStore) => T): T {
  const store = useContext(FavoriteModelsContext)
  if (!store) {
    throw new Error("useFavoriteModelsStore must be used within FavoriteModelsProvider")
  }
  return useStore(store, selector)
}
