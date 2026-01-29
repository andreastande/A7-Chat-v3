import { decrypt, deriveKey, encrypt } from "./crypto"
import { deleteApiKeyRecord, getAllApiKeyProviders, getApiKeyRecord, hasApiKeyRecord, setApiKeyRecord } from "./db"

export { API_KEY_CONFIGS, API_KEY_PROVIDERS, type ApiKeyConfig, type ApiKeyProvider } from "./types"

export async function saveApiKey(provider: string, plainKey: string, userId: string): Promise<void> {
  const cryptoKey = await deriveKey(userId)
  const { encrypted, iv } = await encrypt(plainKey, cryptoKey)
  await setApiKeyRecord(provider, encrypted, iv)
}

export async function loadApiKey(provider: string, userId: string): Promise<string | null> {
  const record = await getApiKeyRecord(provider)
  if (!record) return null

  const cryptoKey = await deriveKey(userId)
  return decrypt(record.encryptedKey, record.iv, cryptoKey)
}

export async function removeApiKey(provider: string): Promise<void> {
  await deleteApiKeyRecord(provider)
}

export async function hasApiKey(provider: string): Promise<boolean> {
  return hasApiKeyRecord(provider)
}

export async function getConfiguredProviders(): Promise<string[]> {
  return getAllApiKeyProviders()
}
