import dedent from "dedent"

export type Model = {
  id: string
  name: string
}

export const creators = {
  openai: {
    name: "OpenAI",
    models: [
      { id: "openai/gpt-5.2", name: "GPT-5.2" },
      { id: "openai/gpt-5", name: "GPT-5" },
      { id: "openai/gpt-5-mini", name: "GPT-5 mini" },
      { id: "openai/gpt-4o", name: "GPT-4o" },
      { id: "openai/gpt-oss-120b", name: "gpt-oss-120b" },
      { id: "openai/gpt-oss-20b", name: "gpt-oss-20b" },
    ],
  },
  anthropic: {
    name: "Anthropic",
    models: [
      { id: "anthropic/claude-sonnet-4.5", name: "Claude Sonnet 4.5" },
      { id: "anthropic/claude-haiku-4.5", name: "Claude Haiku 4.5" },
      { id: "anthropic/claude-opus-4.5", name: "Claude Opus 4.5" },
    ],
  },
  google: {
    name: "Google",
    models: [
      { id: "google/gemini-3-flash", name: "Gemini 3 Flash" },
      { id: "google/gemini-3-pro-preview", name: "Gemini 3 Pro" },
      { id: "google/gemini-3-pro-image", name: "Nano Banana Pro" },
    ],
  },
  xai: {
    name: "xAI",
    models: [
      { id: "xai/grok-4.1-fast-reasoning", name: "Grok 4.1 Fast Reasoning" },
      { id: "xai/grok-4.1-fast-non-reasoning", name: "Grok 4.1 Fast Non-Reasoning" },
      { id: "xai/grok-code-fast-1", name: "Grok Code Fast 1" },
    ],
  },
  zai: {
    name: "Z.ai",
    models: [{ id: "zai/glm-4.7", name: "GLM 4.7" }],
  },
  moonshotai: {
    name: "Moonshot AI",
    models: [
      { id: "moonshotai/kimi-k2", name: "Kimi K2" },
      { id: "moonshotai/kimi-k2-turbo", name: "Kimi K2 Turbo" },
      { id: "moonshotai/kimi-k2-thinking", name: "Kimi K2 Thinking" },
      { id: "moonshotai/kimi-k2-thinking-turbo", name: "Kimi K2 Thinking Turbo" },
    ],
  },
  deepseek: {
    name: "DeepSeek",
    models: [
      { id: "deepseek/deepseek-v3.2", name: "DeepSeek V3.2" },
      { id: "deepseek/deepseek-v3.2-thinking", name: "DeepSeek V3.2 Thinking" },
      { id: "deepseek/deepseek-v3.2-exp", name: "DeepSeek V3.2 Exp" },
      { id: "deepseek/deepseek-r1", name: "DeepSeek R1" },
    ],
  },
  alibaba: {
    name: "Alibaba",
    models: [
      { id: "alibaba/qwen-3-235b", name: "Qwen3 235B" },
      { id: "alibaba/qwen3-max", name: "Qwen3 Max" },
    ],
  },
  meta: {
    name: "Meta",
    models: [
      { id: "meta/llama-4-maverick", name: "Llama 4 Maverick" },
      { id: "meta/llama-4-scout", name: "Llama 4 Scout" },
    ],
  },
  minimax: {
    name: "MiniMax",
    models: [
      { id: "minimax/minimax-m2.1", name: "MiniMax M2.1" },
      { id: "minimax/minimax-m2.1-lightning", name: "MiniMax M2.1 Lightning" },
    ],
  },
} satisfies Record<string, { name: string; models: Model[] }>

export type Creator = keyof typeof creators

export const creatorIds = Object.keys(creators) as Creator[]
export const allModels = Object.values(creators).flatMap((c) => c.models)

export const DEFAULT_MODEL_ID = "openai/gpt-5.2"

export function isValidModelId(id: string) {
  return allModels.some((m) => m.id === id)
}

export function getValidModelId(id: string | undefined) {
  return id && isValidModelId(id) ? id : DEFAULT_MODEL_ID
}

export function getModelsByCreator(creator: Creator) {
  return creators[creator].models
}

export function getCreatorName(creator: Creator) {
  return creators[creator].name
}

export function getModelName(modelId: string) {
  return allModels.find((m) => m.id === modelId)?.name
}

export function getSystemPrompt(modelId: string) {
  return dedent`
    If the user asks who you are, you are ${getModelName(modelId)} \
    from ${getCreatorName(modelId.split("/")[0] as Creator)}.

    Use double dollar signs ($$) to delimit mathematical expressions. Do not use \
    single dollar signs ($) for math to avoid conflicts with currency symbols in \
    regular text.
  `
}
