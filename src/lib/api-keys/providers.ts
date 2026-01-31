// =============================================================================
// Provider Configurations
// =============================================================================
//
// Metadata for supported API key providers. Used in the settings UI
// to show provider names, descriptions, and documentation links.
// =============================================================================

import type { ApiKeyProvider } from "./types"

/** Metadata for a supported provider. */
export type ProviderInfo = {
  id: ApiKeyProvider
  name: string
  description: string
  placeholder: string
  docsUrl: string
}

/** Registry of all supported providers. */
export const providers: Record<ApiKeyProvider, ProviderInfo> = {
  "ai-gateway": {
    id: "ai-gateway",
    name: "AI Gateway",
    description: "Vercel AI Gateway - use your provider API keys",
    placeholder: "Your provider API key (e.g., sk-...)",
    docsUrl: "https://vercel.com/docs/ai-gateway",
  },
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    description: "Access 200+ models with a single API key",
    placeholder: "sk-or-v1-...",
    docsUrl: "https://openrouter.ai/keys",
  },
}

/** List of provider IDs for iteration. */
export const providerIds = Object.keys(providers) as ApiKeyProvider[]
