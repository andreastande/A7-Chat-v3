export type PriceTier = {
  cost: number
  upTo?: number
}

export type Model = {
  id: string
  name: string
  maxContextTokens: number
  maxOutputTokens: number
  pricing: {
    input: number | PriceTier[]
    inputCacheRead?: number | PriceTier[]
    output: number | PriceTier[]
  }
}

export type CreatorId =
  | "openai"
  | "anthropic"
  | "google"
  | "xai"
  | "zai"
  | "moonshotai"
  | "deepseek"
  | "alibaba"
  | "meta"
  | "minimax"

export type Creator = {
  name: string
  models: Model[]
}
