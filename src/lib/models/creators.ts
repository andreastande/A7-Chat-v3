import type { Creator, CreatorId } from "./types"

export const creators = {
  openai: {
    name: "OpenAI",
    models: [
      {
        id: "openai/gpt-5.2",
        name: "GPT-5.2",
        maxContextTokens: 400000,
        maxOutputTokens: 128000,
        pricing: {
          input: 1.75,
          inputCacheRead: 0.18,
          output: 14,
        },
      },
      {
        id: "openai/gpt-5",
        name: "GPT-5",
        maxContextTokens: 400000,
        maxOutputTokens: 128000,
        pricing: {
          input: 1.25,
          inputCacheRead: 0.13,
          output: 10,
        },
      },
      {
        id: "openai/gpt-5-mini",
        name: "GPT-5 mini",
        maxContextTokens: 400000,
        maxOutputTokens: 128000,
        pricing: {
          input: 0.25,
          inputCacheRead: 0.03,
          output: 2,
        },
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        pricing: {
          input: 2.5,
          inputCacheRead: 1.25,
          output: 10,
        },
      },
      {
        id: "openai/gpt-oss-120b",
        name: "gpt-oss-120b",
        maxContextTokens: 131072,
        maxOutputTokens: 131072,
        pricing: {
          input: 0.1,
          output: 0.5,
        },
      },
      {
        id: "openai/gpt-oss-20b",
        name: "gpt-oss-20b",
        maxContextTokens: 128000,
        maxOutputTokens: 8192,
        pricing: {
          input: 0.07,
          output: 0.3,
        },
      },
    ],
  },
  anthropic: {
    name: "Anthropic",
    models: [
      {
        id: "anthropic/claude-sonnet-4.5",
        name: "Claude Sonnet 4.5",
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        pricing: {
          input: [{ cost: 3, upTo: 200_000 }, { cost: 6 }],
          inputCacheRead: [{ cost: 0.3, upTo: 200_000 }, { cost: 0.6 }],
          output: [{ cost: 15, upTo: 200_000 }, { cost: 22.5 }],
        },
      },
      {
        id: "anthropic/claude-haiku-4.5",
        name: "Claude Haiku 4.5",
        maxContextTokens: 200000,
        maxOutputTokens: 64000,
        pricing: {
          input: 1,
          inputCacheRead: 0.1,
          output: 5,
        },
      },
      {
        id: "anthropic/claude-opus-4.6",
        name: "Claude Opus 4.6",
        maxContextTokens: 1000000,
        maxOutputTokens: 128000,
        pricing: {
          input: [{ cost: 5, upTo: 200_000 }, { cost: 10 }],
          inputCacheRead: [{ cost: 0.5, upTo: 200_000 }, { cost: 1 }],
          output: [{ cost: 25, upTo: 200_000 }, { cost: 37.5 }],
        },
      },
    ],
  },
  google: {
    name: "Google",
    models: [
      {
        id: "google/gemini-3-flash",
        name: "Gemini 3 Flash",
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        pricing: {
          input: 0.5,
          inputCacheRead: 0.05,
          output: 3,
        },
      },
      {
        id: "google/gemini-3-pro-preview",
        name: "Gemini 3 Pro",
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        pricing: {
          input: [{ cost: 2, upTo: 200_000 }, { cost: 4 }],
          inputCacheRead: [{ cost: 0.2, upTo: 200_000 }, { cost: 0.4 }],
          output: [{ cost: 12, upTo: 200_000 }, { cost: 18 }],
        },
      },
      {
        id: "google/gemini-3-pro-image",
        name: "Nano Banana Pro",
        maxContextTokens: 65536,
        maxOutputTokens: 32768,
        pricing: {
          input: 2,
          output: 120,
        },
      },
    ],
  },
  xai: {
    name: "xAI",
    models: [
      {
        id: "xai/grok-4.1-fast-reasoning",
        name: "Grok 4.1 Fast Reasoning",
        maxContextTokens: 2000000,
        maxOutputTokens: 30000,
        pricing: {
          input: [{ cost: 0.2, upTo: 128_000 }, { cost: 0.4 }],
          inputCacheRead: 0.05,
          output: [{ cost: 0.5, upTo: 128_000 }, { cost: 1 }],
        },
      },
      {
        id: "xai/grok-4.1-fast-non-reasoning",
        name: "Grok 4.1 Fast Non-Reasoning",
        maxContextTokens: 2000000,
        maxOutputTokens: 30000,
        pricing: {
          input: [{ cost: 0.2, upTo: 128_000 }, { cost: 0.4 }],
          inputCacheRead: 0.05,
          output: [{ cost: 0.5, upTo: 128_000 }, { cost: 1 }],
        },
      },
      {
        id: "xai/grok-code-fast-1",
        name: "Grok Code Fast 1",
        maxContextTokens: 256000,
        maxOutputTokens: 256000,
        pricing: {
          input: 0.2,
          inputCacheRead: 0.02,
          output: 1.5,
        },
      },
    ],
  },
  zai: {
    name: "Z.ai",
    models: [
      {
        id: "zai/glm-4.7",
        name: "GLM 4.7",
        maxContextTokens: 202752,
        maxOutputTokens: 120000,
        pricing: {
          input: 0.43,
          inputCacheRead: 0.08,
          output: 1.75,
        },
      },
    ],
  },
  moonshotai: {
    name: "Moonshot AI",
    models: [
      {
        id: "moonshotai/kimi-k2.5",
        name: "Kimi K2.5",
        maxContextTokens: 256000,
        maxOutputTokens: 256000,
        pricing: {
          input: 0.5,
          output: 2.8,
        },
      },
      {
        id: "moonshotai/kimi-k2",
        name: "Kimi K2",
        maxContextTokens: 131072,
        maxOutputTokens: 16384,
        pricing: {
          input: 0.5,
          output: 2,
        },
      },
      {
        id: "moonshotai/kimi-k2-turbo",
        name: "Kimi K2 Turbo",
        maxContextTokens: 256000,
        maxOutputTokens: 16384,
        pricing: {
          input: 2.4,
          output: 10,
        },
      },
      {
        id: "moonshotai/kimi-k2-thinking",
        name: "Kimi K2 Thinking",
        maxContextTokens: 216144,
        maxOutputTokens: 216144,
        pricing: {
          input: 0.47,
          inputCacheRead: 0.141,
          output: 2,
        },
      },
      {
        id: "moonshotai/kimi-k2-thinking-turbo",
        name: "Kimi K2 Thinking Turbo",
        maxContextTokens: 262114,
        maxOutputTokens: 262114,
        pricing: {
          input: 1.15,
          inputCacheRead: 0.15,
          output: 8,
        },
      },
    ],
  },
  deepseek: {
    name: "DeepSeek",
    models: [
      {
        id: "deepseek/deepseek-v3.2",
        name: "DeepSeek V3.2",
        maxContextTokens: 163842,
        maxOutputTokens: 8000,
        pricing: {
          input: 0.27,
          inputCacheRead: 0.216,
          output: 0.4,
        },
      },
      {
        id: "deepseek/deepseek-v3.2-thinking",
        name: "DeepSeek V3.2 Thinking",
        maxContextTokens: 128000,
        maxOutputTokens: 64000,
        pricing: {
          input: 0.28,
          inputCacheRead: 0.028,
          output: 0.42,
        },
      },
      {
        id: "deepseek/deepseek-v3.2-exp",
        name: "DeepSeek V3.2 Exp",
        maxContextTokens: 163840,
        maxOutputTokens: 163840,
        pricing: {
          input: 0.27,
          output: 0.4,
        },
      },
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        maxContextTokens: 160000,
        maxOutputTokens: 16384,
        pricing: {
          input: 0.5,
          inputCacheRead: 0.4,
          output: 2.15,
        },
      },
    ],
  },
  alibaba: {
    name: "Alibaba",
    models: [
      {
        id: "alibaba/qwen-3-235b",
        name: "Qwen3 235B",
        maxContextTokens: 40960,
        maxOutputTokens: 16384,
        pricing: {
          input: 0.071,
          output: 0.463,
        },
      },
      {
        id: "alibaba/qwen3-max",
        name: "Qwen3 Max",
        maxContextTokens: 262144,
        maxOutputTokens: 65536,
        pricing: {
          input: [{ cost: 0.845, upTo: 32_768 }, { cost: 1.4, upTo: 131_072 }, { cost: 2.11 }],
          output: [{ cost: 3.38, upTo: 32_768 }, { cost: 5.64, upTo: 131_072 }, { cost: 8.45 }],
        },
      },
    ],
  },
  meta: {
    name: "Meta",
    models: [
      {
        id: "meta/llama-4-maverick",
        name: "Llama 4 Maverick",
        maxContextTokens: 131072,
        maxOutputTokens: 8192,
        pricing: {
          input: 0.15,
          output: 0.6,
        },
      },
      {
        id: "meta/llama-4-scout",
        name: "Llama 4 Scout",
        maxContextTokens: 131072,
        maxOutputTokens: 8192,
        pricing: {
          input: 0.08,
          output: 0.3,
        },
      },
    ],
  },
  minimax: {
    name: "MiniMax",
    models: [
      {
        id: "minimax/minimax-m2.1",
        name: "MiniMax M2.1",
        maxContextTokens: 204800,
        maxOutputTokens: 131072,
        pricing: {
          input: 0.3,
          inputCacheRead: 0.15,
          output: 1.2,
        },
      },
      {
        id: "minimax/minimax-m2.1-lightning",
        name: "MiniMax M2.1 Lightning",
        maxContextTokens: 204800,
        maxOutputTokens: 131072,
        pricing: {
          input: 0.3,
          inputCacheRead: 0.03,
          output: 2.4,
        },
      },
    ],
  },
} satisfies Record<string, Creator>

export const creatorIds = Object.keys(creators) as CreatorId[]
export const allModels = Object.values(creators).flatMap((c) => c.models)
