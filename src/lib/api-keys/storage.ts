// =============================================================================
// IndexedDB Storage
// =============================================================================
//
// Encrypted API keys are stored in IndexedDB with two object stores:
// - "keys": Stores encrypted API key records (namespaced by user)
// - "meta": Stores metadata like the active key ID (per namespace)
// =============================================================================

import type { StoredApiKey } from "./types"

const DB_NAME = "a7-chat-keys"
const DB_VERSION = 1
const KEYS_STORE = "keys"
const META_STORE = "meta"

let cachedDb: IDBDatabase | null = null

/**
 * Open the IndexedDB database, creating object stores if needed.
 * Caches the connection for reuse across operations.
 */
function openDatabase(): Promise<IDBDatabase> {
  if (cachedDb) return Promise.resolve(cachedDb)

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      cachedDb = request.result

      // Reset cache if connection closes unexpectedly
      cachedDb.onclose = () => {
        cachedDb = null
      }

      // Handle version change from another tab
      cachedDb.onversionchange = () => {
        cachedDb?.close()
        cachedDb = null
      }

      resolve(cachedDb)
    }

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result

      if (!db.objectStoreNames.contains(KEYS_STORE)) {
        const keysStore = db.createObjectStore(KEYS_STORE, { keyPath: "id" })
        keysStore.createIndex("namespace", "namespace", { unique: false })
      }

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" })
      }
    }
  })
}

/**
 * Get all stored (encrypted) API keys for a given namespace.
 */
export async function getAllStoredKeys(namespace: string): Promise<StoredApiKey[]> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(KEYS_STORE, "readonly")
    const store = transaction.objectStore(KEYS_STORE)
    const index = store.index("namespace")
    const request = index.getAll(namespace)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Save an encrypted API key to storage.
 */
export async function saveStoredKey(key: StoredApiKey): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(KEYS_STORE, "readwrite")
    const store = transaction.objectStore(KEYS_STORE)
    const request = store.put(key)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Delete an API key from storage.
 */
export async function deleteStoredKey(id: string): Promise<void> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(KEYS_STORE, "readwrite")
    const store = transaction.objectStore(KEYS_STORE)
    const request = store.delete(id)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Get the ID of the currently active API key for a namespace.
 */
export async function getActiveKeyId(namespace: string): Promise<string | null> {
  const db = await openDatabase()
  const metaKey = `activeKeyId-${namespace}`

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(META_STORE, "readonly")
    const store = transaction.objectStore(META_STORE)
    const request = store.get(metaKey)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result?.value ?? null)
  })
}

/**
 * Set the active API key ID for a namespace, or clear it with null.
 */
export async function setActiveKeyId(namespace: string, id: string | null): Promise<void> {
  const db = await openDatabase()
  const metaKey = `activeKeyId-${namespace}`

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(META_STORE, "readwrite")
    const store = transaction.objectStore(META_STORE)

    const request = id === null ? store.delete(metaKey) : store.put({ key: metaKey, value: id })

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Get the count of keys in the anonymous namespace.
 */
export async function getAnonymousKeysCount(): Promise<number> {
  const db = await openDatabase()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(KEYS_STORE, "readonly")
    const store = transaction.objectStore(KEYS_STORE)
    const index = store.index("namespace")
    const request = index.count("anonymous")

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
  })
}

/**
 * Transfer all keys from anonymous namespace to target namespace.
 * Updates the namespace field in place (since id is the keyPath).
 * Also transfers active key metadata if target has no active key.
 */
export async function transferKeysToNamespace(targetNamespace: string): Promise<StoredApiKey[]> {
  const db = await openDatabase()
  const anonymousKeys = await getAllStoredKeys("anonymous")

  if (anonymousKeys.length === 0) {
    return []
  }

  const [anonymousActiveKeyId, targetActiveKeyId] = await Promise.all([
    getActiveKeyId("anonymous"),
    getActiveKeyId(targetNamespace),
  ])

  return new Promise((resolve, reject) => {
    const transaction = db.transaction([KEYS_STORE, META_STORE], "readwrite")
    const keysStore = transaction.objectStore(KEYS_STORE)
    const metaStore = transaction.objectStore(META_STORE)

    const transferredKeys: StoredApiKey[] = []

    transaction.onerror = () => reject(transaction.error)
    transaction.oncomplete = () => resolve(transferredKeys)

    // Update each key's namespace (put overwrites since id is keyPath)
    for (const key of anonymousKeys) {
      const updatedKey: StoredApiKey = { ...key, namespace: targetNamespace }
      keysStore.put(updatedKey)
      transferredKeys.push(updatedKey)
    }

    // Clear anonymous active key metadata
    metaStore.delete(`activeKeyId-anonymous`)

    // Transfer active key if target has none
    if (!targetActiveKeyId && anonymousActiveKeyId) {
      metaStore.put({ key: `activeKeyId-${targetNamespace}`, value: anonymousActiveKeyId })
    }
  })
}
