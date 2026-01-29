import { createStore } from "zustand"
import { getConfiguredProviders, loadApiKey, removeApiKey, saveApiKey } from "@/lib/api-keys"

type ApiKeysState = {
  configuredProviders: string[]
  isInitialized: boolean
}

type ApiKeysActions = {
  initialize: () => Promise<void>
  addKey: (provider: string, key: string, userId: string) => Promise<void>
  deleteKey: (provider: string) => Promise<void>
  getKey: (provider: string, userId: string) => Promise<string | null>
  hasKey: (provider: string) => boolean
}

export type ApiKeysStore = ApiKeysState & ApiKeysActions

export function createApiKeysStore() {
  return createStore<ApiKeysStore>((set, get) => ({
    configuredProviders: [],
    isInitialized: false,

    initialize: async () => {
      if (get().isInitialized) return

      try {
        const providers = await getConfiguredProviders()
        set({ configuredProviders: providers, isInitialized: true })
      } catch {
        set({ isInitialized: true })
      }
    },

    addKey: async (provider, key, userId) => {
      await saveApiKey(provider, key, userId)
      set((state) => ({
        configuredProviders: state.configuredProviders.includes(provider)
          ? state.configuredProviders
          : [...state.configuredProviders, provider],
      }))
    },

    deleteKey: async (provider) => {
      await removeApiKey(provider)
      set((state) => ({
        configuredProviders: state.configuredProviders.filter((p) => p !== provider),
      }))
    },

    getKey: async (provider, userId) => {
      return loadApiKey(provider, userId)
    },

    hasKey: (provider) => {
      return get().configuredProviders.includes(provider)
    },
  }))
}
