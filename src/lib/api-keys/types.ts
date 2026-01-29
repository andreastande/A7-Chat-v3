export const API_KEY_PROVIDERS = ["gateway"] as const
export type ApiKeyProvider = (typeof API_KEY_PROVIDERS)[number]

export interface ApiKeyConfig {
  provider: ApiKeyProvider
  label: string
  description: string
  placeholder: string
  helpUrl?: string
}

export const API_KEY_CONFIGS: Record<ApiKeyProvider, ApiKeyConfig> = {
  gateway: {
    provider: "gateway",
    label: "AI Gateway",
    description: "Your Vercel AI Gateway API key for accessing all supported models.",
    placeholder: "aigw_...",
    helpUrl: "https://vercel.com/docs/ai-gateway",
  },
}

export interface ApiKeyRecord {
  provider: string
  encryptedKey: string
  iv: string
  createdAt: number
  updatedAt: number
}
