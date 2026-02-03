// =============================================================================
// IndexedDB Storage
// =============================================================================
//
// Encrypted API keys are stored in IndexedDB with two object stores:
// - "keys": Stores encrypted API key records (namespaced by user)
// - "meta": Stores metadata like the active key ID (per namespace)
// =============================================================================

import { openDB, type DBSchema, type IDBPDatabase } from "idb"
import type { StoredApiKey } from "./types"

const DB_NAME = "a7-chat-keys"
const DB_VERSION = 1
const KEYS_STORE = "keys"
const META_STORE = "meta"

type MetaRecord = {
  key: string
  value: string
}

interface ApiKeysDB extends DBSchema {
  keys: {
    key: string
    value: StoredApiKey
    indexes: { namespace: string }
  }
  meta: {
    key: string
    value: MetaRecord
  }
}

let dbPromise: Promise<IDBPDatabase<ApiKeysDB>> | null = null

/**
 * Open the IndexedDB database, creating object stores if needed.
 * Caches the connection for reuse across operations.
 */
function openDatabase(): Promise<IDBPDatabase<ApiKeysDB>> {
  if (dbPromise) return dbPromise

  let dbRef: IDBPDatabase<ApiKeysDB> | null = null

  dbPromise = openDB<ApiKeysDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(KEYS_STORE)) {
        const keysStore = db.createObjectStore(KEYS_STORE, { keyPath: "id" })
        keysStore.createIndex("namespace", "namespace", { unique: false })
      }

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" })
      }
    },
    blocking() {
      dbRef?.close()
      dbPromise = null
    },
    terminated() {
      dbPromise = null
    },
  })
    .then((db) => {
      dbRef = db
      return db
    })
    .catch((error) => {
      dbPromise = null
      throw error
    })

  return dbPromise
}

/**
 * Get all stored (encrypted) API keys for a given namespace.
 */
export async function getAllStoredKeys(namespace: string): Promise<StoredApiKey[]> {
  const db = await openDatabase()

  return db.getAllFromIndex(KEYS_STORE, "namespace", namespace)
}

/**
 * Save an encrypted API key to storage.
 */
export async function saveStoredKey(key: StoredApiKey): Promise<void> {
  const db = await openDatabase()

  await db.put(KEYS_STORE, key)
}

/**
 * Delete an API key from storage.
 */
export async function deleteStoredKey(id: string): Promise<void> {
  const db = await openDatabase()

  await db.delete(KEYS_STORE, id)
}

/**
 * Get the ID of the currently active API key for a namespace.
 */
export async function getActiveKeyId(namespace: string): Promise<string | null> {
  const db = await openDatabase()
  const metaKey = `activeKeyId-${namespace}`

  const record = await db.get(META_STORE, metaKey)
  return record?.value ?? null
}

/**
 * Set the active API key ID for a namespace, or clear it with null.
 */
export async function setActiveKeyId(namespace: string, id: string | null): Promise<void> {
  const db = await openDatabase()
  const metaKey = `activeKeyId-${namespace}`

  if (id === null) {
    await db.delete(META_STORE, metaKey)
    return
  }

  await db.put(META_STORE, { key: metaKey, value: id })
}

/**
 * Get the count of keys in the anonymous namespace.
 */
export async function getAnonymousKeysCount(): Promise<number> {
  const db = await openDatabase()

  return db.countFromIndex(KEYS_STORE, "namespace", "anonymous")
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

  const transaction = db.transaction([KEYS_STORE, META_STORE], "readwrite")
  const keysStore = transaction.objectStore(KEYS_STORE)
  const metaStore = transaction.objectStore(META_STORE)

  const transferredKeys: StoredApiKey[] = []

  // Update each key's namespace (put overwrites since id is keyPath)
  for (const key of anonymousKeys) {
    const updatedKey: StoredApiKey = { ...key, namespace: targetNamespace }
    await keysStore.put(updatedKey)
    transferredKeys.push(updatedKey)
  }

  // Clear anonymous active key metadata
  await metaStore.delete(`activeKeyId-anonymous`)

  // Transfer active key if target has none
  if (!targetActiveKeyId && anonymousActiveKeyId) {
    await metaStore.put({ key: `activeKeyId-${targetNamespace}`, value: anonymousActiveKeyId })
  }

  await transaction.done
  return transferredKeys
}
