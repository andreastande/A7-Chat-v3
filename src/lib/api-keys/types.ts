export const API_KEY_PROVIDERS = ["ai-gateway", "openrouter"] as const
export type ApiKeyProvider = (typeof API_KEY_PROVIDERS)[number]

export const API_KEY_PROVIDER_LABELS = {
  "ai-gateway": "AI Gateway",
  openrouter: "OpenRouter",
} as const satisfies Record<ApiKeyProvider, string>
export type ApiKeyProviderLabel = (typeof API_KEY_PROVIDER_LABELS)[ApiKeyProvider]

export type StoredApiKey = {
  id: string
  namespace: string // User ID or "anonymous"
  provider: ApiKeyProvider
  name: string
  encryptedKey: string // Base64 encoded
  iv: string // Base64 encoded
  createdAt: number
}

export type DecryptedApiKey = {
  id: string
  provider: ApiKeyProvider
  name: string
  key: string // Plaintext (memory only)
  createdAt: number
}

export type ApiKeyPayload = {
  provider: ApiKeyProvider
  key: string
}
