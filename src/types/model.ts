export type Model = {
  id: string
  object: string
  created: number
  owned_by: string
  name: string
  description: string
  context_window: number
  max_tokens: number
  type: "language" | "embedding" | "image"
  tags?: string[]
  pricing: {
    input?: string
    output?: string
    input_cache_read?: string
    input_cache_write?: string
    image?: string
    web_search?: string
  }
}
