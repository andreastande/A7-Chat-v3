import z from "zod"
import { API_KEY_PROVIDERS, type ApiKeyProvider, type ApiKeyProviderLabel } from "@/lib/api-keys/types"

export const apiKeySchema = z.object({
  provider: z.enum(API_KEY_PROVIDERS, { error: "Please choose a valid provider" }),
  name: z.string().min(1, { error: "Name is required" }),
  key: z.string().min(1, { error: "API key is required" }),
})

export type ApiKeyFormValues = z.infer<typeof apiKeySchema>

export const providerItems: { label: ApiKeyProviderLabel; value: ApiKeyProvider }[] = [
  { label: "AI Gateway", value: "ai-gateway" },
  { label: "OpenRouter", value: "openrouter" },
]
