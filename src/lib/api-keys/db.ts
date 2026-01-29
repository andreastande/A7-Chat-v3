import type { ApiKeyRecord } from "./types"

const DB_NAME = "a7-chat-keys"
const DB_VERSION = 1
const STORE_NAME = "api-keys"

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(new Error("Failed to open IndexedDB"))

    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "provider" })
      }
    }
  })
}

export async function getApiKeyRecord(provider: string): Promise<ApiKeyRecord | null> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.get(provider)

    request.onerror = () => {
      db.close()
      reject(new Error("Failed to get API key"))
    }

    request.onsuccess = () => {
      db.close()
      resolve(request.result ?? null)
    }
  })
}

export async function setApiKeyRecord(
  provider: string,
  encryptedKey: string,
  iv: string,
): Promise<void> {
  const db = await openDatabase()
  const now = Date.now()

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)

    const record: ApiKeyRecord = {
      provider,
      encryptedKey,
      iv,
      createdAt: now,
      updatedAt: now,
    }

    const request = store.put(record)

    request.onerror = () => {
      db.close()
      reject(new Error("Failed to save API key"))
    }

    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

export async function deleteApiKeyRecord(provider: string): Promise<void> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(provider)

    request.onerror = () => {
      db.close()
      reject(new Error("Failed to delete API key"))
    }

    request.onsuccess = () => {
      db.close()
      resolve()
    }
  })
}

export async function hasApiKeyRecord(provider: string): Promise<boolean> {
  const record = await getApiKeyRecord(provider)
  return record !== null
}

export async function getAllApiKeyProviders(): Promise<string[]> {
  const db = await openDatabase()
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly")
    const store = transaction.objectStore(STORE_NAME)
    const request = store.getAllKeys()

    request.onerror = () => {
      db.close()
      reject(new Error("Failed to get API key providers"))
    }

    request.onsuccess = () => {
      db.close()
      resolve(request.result as string[])
    }
  })
}
