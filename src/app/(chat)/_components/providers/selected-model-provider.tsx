"use client"

import { createContext, type ReactNode, useContext, useState } from "react"
import { useStore } from "zustand"
import { createSelectedModelStore, type SelectedModelStore } from "../../_stores/selected-model-store"

type SelectedModelStoreApi = ReturnType<typeof createSelectedModelStore>

const SelectedModelContext = createContext<SelectedModelStoreApi | null>(null)

export function SelectedModelProvider({ children, initialModelId }: { children: ReactNode; initialModelId: string }) {
  const [store] = useState(() => createSelectedModelStore(initialModelId))
  return <SelectedModelContext.Provider value={store}>{children}</SelectedModelContext.Provider>
}

export function useSelectedModelStore<T>(selector: (state: SelectedModelStore) => T): T {
  const store = useContext(SelectedModelContext)
  if (!store) {
    throw new Error("useSelectedModelStore must be used within SelectedModelProvider")
  }
  return useStore(store, selector)
}
