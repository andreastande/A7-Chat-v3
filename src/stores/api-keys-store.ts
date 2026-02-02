import { createStore } from "zustand"
import { decrypt, encrypt } from "@/lib/api-keys/encryption"
import {
  deleteStoredKey,
  getActiveKeyId,
  getAllStoredKeys,
  getAnonymousKeysCount,
  saveStoredKey,
  setActiveKeyId,
  transferKeysToNamespace,
} from "@/lib/api-keys/storage"
import type { ApiKeyPayload, ApiKeyProvider, DecryptedApiKey, StoredApiKey } from "@/lib/api-keys/types"

type ApiKeysState = {
  namespace: string
  keys: DecryptedApiKey[]
  activeKeyId: string | null
  anonymousKeysCount: number
  isInitialized: boolean
}

type ApiKeysActions = {
  initialize: () => Promise<void>
  addKey: (key: { provider: ApiKeyProvider; name: string; key: string }) => Promise<string>
  removeKey: (id: string) => Promise<void>
  setActiveKey: (id: string | null) => Promise<void>
  getActiveKeyPayload: () => ApiKeyPayload | null
  transferFromAnonymous: () => Promise<number>
}

export type ApiKeysStore = ApiKeysState & ApiKeysActions

export function createApiKeysStore(namespace: string) {
  return createStore<ApiKeysStore>((set, get) => ({
    namespace,
    keys: [],
    activeKeyId: null,
    anonymousKeysCount: 0,
    isInitialized: false,

    initialize: async () => {
      if (get().isInitialized) return

      const { namespace } = get()
      const [storedKeys, activeId] = await Promise.all([getAllStoredKeys(namespace), getActiveKeyId(namespace)])

      const decryptedKeys: DecryptedApiKey[] = []

      for (const stored of storedKeys) {
        try {
          decryptedKeys.push({
            id: stored.id,
            provider: stored.provider,
            name: stored.name,
            key: await decrypt(stored.encryptedKey, stored.iv),
            createdAt: stored.createdAt,
          })
        } catch {
          // Key is corrupted or fingerprint changed - remove it silently
          console.warn(`Failed to decrypt API key "${stored.name}", removing from storage`)
          await deleteStoredKey(stored.id)
        }
      }

      // Validate active key still exists
      const validActiveId = decryptedKeys.some((k) => k.id === activeId) ? activeId : null

      // Only fetch anonymous keys count for authenticated users
      const anonCount = namespace !== "anonymous" ? await getAnonymousKeysCount() : 0

      set({
        keys: decryptedKeys,
        activeKeyId: validActiveId,
        anonymousKeysCount: anonCount,
        isInitialized: true,
      })
    },

    addKey: async ({ provider, name, key }) => {
      const { namespace } = get()
      const id = crypto.randomUUID()
      const { encrypted, iv } = await encrypt(key)

      const storedKey: StoredApiKey = {
        id,
        namespace,
        provider,
        name,
        encryptedKey: encrypted,
        iv,
        createdAt: Date.now(),
      }

      await saveStoredKey(storedKey)

      const decryptedKey: DecryptedApiKey = {
        id,
        provider,
        name,
        key,
        createdAt: storedKey.createdAt,
      }

      set((state) => ({
        keys: [...state.keys, decryptedKey],
      }))

      // Auto-activate new key
      await get().setActiveKey(id)

      return id
    },

    removeKey: async (id) => {
      await deleteStoredKey(id)

      const { activeKeyId, namespace } = get()

      set((state) => ({
        keys: state.keys.filter((k) => k.id !== id),
        activeKeyId: activeKeyId === id ? null : activeKeyId,
      }))

      if (activeKeyId === id) {
        await setActiveKeyId(namespace, null)
      }
    },

    setActiveKey: async (id) => {
      const { namespace } = get()
      await setActiveKeyId(namespace, id)
      set({ activeKeyId: id })
    },

    getActiveKeyPayload: () => {
      const { keys, activeKeyId } = get()
      const activeKey = keys.find((k) => k.id === activeKeyId)

      if (!activeKey) return null

      return {
        provider: activeKey.provider,
        key: activeKey.key,
      }
    },

    transferFromAnonymous: async () => {
      const { namespace } = get()

      // No-op for anonymous users
      if (namespace === "anonymous") {
        return 0
      }

      const transferredStoredKeys = await transferKeysToNamespace(namespace)

      if (transferredStoredKeys.length === 0) {
        return 0
      }

      // Decrypt the transferred keys
      const decryptedKeys: DecryptedApiKey[] = []
      for (const stored of transferredStoredKeys) {
        try {
          decryptedKeys.push({
            id: stored.id,
            provider: stored.provider,
            name: stored.name,
            key: await decrypt(stored.encryptedKey, stored.iv),
            createdAt: stored.createdAt,
          })
        } catch {
          console.warn(`Failed to decrypt transferred key "${stored.name}"`)
        }
      }

      // Get the new active key ID (may have been transferred from anonymous)
      const newActiveKeyId = await getActiveKeyId(namespace)

      set((state) => ({
        keys: [...state.keys, ...decryptedKeys],
        activeKeyId: state.activeKeyId ?? newActiveKeyId,
        anonymousKeysCount: 0,
      }))

      return decryptedKeys.length
    },
  }))
}
