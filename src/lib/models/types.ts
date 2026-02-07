export type Tier = {
  cost: number
  min: number
  max?: number
}

export type PriceSchedule = {
  base: number
  tiers?: Tier[]
}

export type Model = {
  id: string
  name: string
  maxContextTokens: number
  maxOutputTokens: number
  pricing: {
    input: PriceSchedule
    inputCacheRead?: PriceSchedule
    output: PriceSchedule
  }
}

export type Creator =
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
