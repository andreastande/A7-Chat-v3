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
  updateKey: (id: string, key: { provider: ApiKeyProvider; name: string; key: string }) => Promise<void>
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

      const { activeKeyId } = get()

      set((state) => ({
        keys: [...state.keys, decryptedKey],
      }))

      // Auto-activate if no key is currently active
      if (!activeKeyId) {
        await get().setActiveKey(id)
      }

      return id
    },

    updateKey: async (id, { provider, name, key }) => {
      const { namespace, keys } = get()
      const existingKey = keys.find((k) => k.id === id)

      if (!existingKey) {
        throw new Error("API key not found")
      }

      const { encrypted, iv } = await encrypt(key)

      const storedKey: StoredApiKey = {
        id,
        namespace,
        provider,
        name,
        encryptedKey: encrypted,
        iv,
        createdAt: existingKey.createdAt,
      }

      await saveStoredKey(storedKey)

      const decryptedKey: DecryptedApiKey = {
        id,
        provider,
        name,
        key,
        createdAt: existingKey.createdAt,
      }

      set((state) => ({
        keys: state.keys.map((k) => (k.id === id ? decryptedKey : k)),
      }))
    },

    removeKey: async (id) => {
      await deleteStoredKey(id)

      const { activeKeyId, namespace, keys } = get()
      const remainingKeys = keys.filter((k) => k.id !== id)

      // Auto-select if only 1 key remains, otherwise clear if active was removed
      let newActiveKeyId = activeKeyId === id ? null : activeKeyId
      if (remainingKeys.length === 1 && !newActiveKeyId) {
        newActiveKeyId = remainingKeys[0].id
      }

      if (newActiveKeyId !== activeKeyId) {
        await setActiveKeyId(namespace, newActiveKeyId)
      }

      set({ keys: remainingKeys, activeKeyId: newActiveKeyId })
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
