"use client"

import { createContext, type ReactNode, useContext, useEffect, useState } from "react"
import { useStore } from "zustand"
import { type ApiKeysStore, createApiKeysStore } from "@/app/(sidebar)/_stores/api-keys-store"
import { useSession } from "../../../../components/providers/session-provider"

type ApiKeysStoreApi = ReturnType<typeof createApiKeysStore>

const ApiKeysContext = createContext<ApiKeysStoreApi | null>(null)

export function ApiKeysProvider({ children }: { children: ReactNode }) {
  const session = useSession()
  const namespace = session?.user?.id ?? "anonymous"

  const [store] = useState(() => createApiKeysStore(namespace))

  useEffect(() => {
    void store.getState().initialize()
  }, [store])

  return <ApiKeysContext.Provider value={store}>{children}</ApiKeysContext.Provider>
}

export function useApiKeysStore<T>(selector: (state: ApiKeysStore) => T): T {
  const store = useContext(ApiKeysContext)
  if (!store) {
    throw new Error("useApiKeysStore must be used within ApiKeysProvider")
  }
  return useStore(store, selector)
}
