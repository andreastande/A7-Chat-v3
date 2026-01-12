"use client"

import { useQuery } from "@tanstack/react-query"
import type { Model } from "@/types"

type ProviderConfig = {
  displayName: string
  modelPriority: string[]
}

const providerConfig: Record<string, ProviderConfig> = {
  openai: {
    displayName: "OpenAI",
    modelPriority: [
      "openai/gpt-5.2",
      "openai/gpt-5",
      "openai/gpt-5-mini",
      "openai/gpt-4o",
      "openai/gpt-oss-120b",
      "openai/gpt-oss-20b",
    ],
  },
  anthropic: {
    displayName: "Anthropic",
    modelPriority: ["anthropic/claude-sonnet-4.5", "anthropic/claude-haiku-4.5", "anthropic/claude-opus-4.5"],
  },
  google: {
    displayName: "Google",
    modelPriority: [
      "google/gemini-3-flash",
      "google/gemini-3-pro-preview",
      "google/gemini-3-pro-image",
      "google/gemini-2.5-flash-image",
    ],
  },
  xai: {
    displayName: "xAI",
    modelPriority: ["xai/grok-4.1-fast-reasoning", "xai/grok-4.1-fast-non-reasoning", "xai/grok-code-fast-1"],
  },
  zai: {
    displayName: "Z.ai",
    modelPriority: ["zai/glm-4.7"],
  },
  moonshotai: {
    displayName: "Moonshot AI",
    modelPriority: [
      "moonshotai/kimi-k2",
      "moonshotai/kimi-k2-turbo",
      "moonshotai/kimi-k2-thinking",
      "moonshotai/kimi-k2-thinking-turbo",
    ],
  },
  deepseek: {
    displayName: "DeepSeek",
    modelPriority: [
      "deepseek/deepseek-v3.2",
      "deepseek/deepseek-v3.2-thinking",
      "deepseek/deepseek-v3.2-exp",
      "deepseek/deepseek-r1",
    ],
  },
  alibaba: {
    displayName: "Alibaba",
    modelPriority: ["alibaba/qwen-3-235b", "alibaba/qwen3-max"],
  },
  meta: {
    displayName: "Meta",
    modelPriority: ["meta/llama-4-maverick", "meta/llama-4-scout"],
  },
  minimax: {
    displayName: "MiniMax",
    modelPriority: ["minimax/minimax-m2.1", "minimax/minimax-m2.1-lightning"],
  },
}

const providerPriority = Object.keys(providerConfig)

const providerDisplayNames = Object.fromEntries(
  Object.entries(providerConfig).map(([id, config]) => [id, config.displayName]),
)

function isAllowedModel(model: Model): boolean {
  const config = providerConfig[model.owned_by]
  if (!config) return false
  return config.modelPriority.includes(model.id)
}

function getModelPriority(model: Model): number {
  const config = providerConfig[model.owned_by]
  if (!config) return Infinity
  const index = config.modelPriority.indexOf(model.id)
  return index === -1 ? Infinity : index
}

const nameOverrides: Record<string, string> = {
  "google/gemini-3-pro-image": "Nano Banana Pro",
  "google/gemini-2.5-flash-image": "Nano Banana",
  "google/gemini-3-pro-preview": "Gemini 3 Pro",
  "meta/llama-4-maverick": "Llama 4 Maverick",
  "meta/llama-4-scout": "Llama 4 Scout",
  "alibaba/qwen-3-235b": "Qwen3 235B",
}

export function useModels() {
  const { data: models } = useQuery<Model[]>({
    queryKey: ["models"],
    queryFn: () =>
      fetch("https://ai-gateway.vercel.sh/v1/models")
        .then((res) => res.json())
        .then((json) => json.data),
    select: (models) => {
      return models
        .filter((m) => m.type !== "embedding" && isAllowedModel(m))
        .map((m) => (nameOverrides[m.id] ? { ...m, name: nameOverrides[m.id] } : m))
        .sort((a, b) => {
          const aProviderIndex = providerPriority.indexOf(a.owned_by)
          const bProviderIndex = providerPriority.indexOf(b.owned_by)

          if (aProviderIndex !== bProviderIndex) {
            return aProviderIndex - bProviderIndex
          }

          const aModelPriority = getModelPriority(a)
          const bModelPriority = getModelPriority(b)

          if (aModelPriority !== bModelPriority) {
            return aModelPriority - bModelPriority
          }

          return a.name.localeCompare(b.name)
        })
    },
  })

  return { models, providers: [...new Set(models?.map((m) => m.owned_by))], providerDisplayNames }
}
