import type { Model, Creator } from "./types"

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
          input: { base: 1.75 },
          inputCacheRead: { base: 0.18 },
          output: { base: 14 },
        },
      },
      {
        id: "openai/gpt-5",
        name: "GPT-5",
        maxContextTokens: 400000,
        maxOutputTokens: 128000,
        pricing: {
          input: { base: 1.25 },
          inputCacheRead: { base: 0.13 },
          output: { base: 10 },
        },
      },
      {
        id: "openai/gpt-5-mini",
        name: "GPT-5 mini",
        maxContextTokens: 400000,
        maxOutputTokens: 128000,
        pricing: {
          input: { base: 0.25 },
          inputCacheRead: { base: 0.03 },
          output: { base: 2 },
        },
      },
      {
        id: "openai/gpt-4o",
        name: "GPT-4o",
        maxContextTokens: 128000,
        maxOutputTokens: 16384,
        pricing: {
          input: { base: 2.5 },
          inputCacheRead: { base: 1.25 },
          output: { base: 10 },
        },
      },
      {
        id: "openai/gpt-oss-120b",
        name: "gpt-oss-120b",
        maxContextTokens: 131072,
        maxOutputTokens: 131072,
        pricing: {
          input: { base: 0.1 },
          output: { base: 0.5 },
        },
      },
      {
        id: "openai/gpt-oss-20b",
        name: "gpt-oss-20b",
        maxContextTokens: 128000,
        maxOutputTokens: 8192,
        pricing: {
          input: { base: 0.07 },
          output: { base: 0.3 },
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
          input: {
            base: 3,
            tiers: [
              { cost: 3, min: 0, max: 200001 },
              { cost: 6, min: 200001 },
            ],
          },
          inputCacheRead: {
            base: 0.3,
            tiers: [
              { cost: 0.3, min: 0, max: 200001 },
              { cost: 0.6, min: 200001 },
            ],
          },
          output: {
            base: 15,
            tiers: [
              { cost: 15, min: 0, max: 200001 },
              { cost: 22.5, min: 200001 },
            ],
          },
        },
      },
      {
        id: "anthropic/claude-haiku-4.5",
        name: "Claude Haiku 4.5",
        maxContextTokens: 200000,
        maxOutputTokens: 64000,
        pricing: {
          input: { base: 1 },
          inputCacheRead: { base: 0.1 },
          output: { base: 5 },
        },
      },
      {
        id: "anthropic/claude-opus-4.5",
        name: "Claude Opus 4.5",
        maxContextTokens: 200000,
        maxOutputTokens: 64000,
        pricing: {
          input: { base: 5 },
          inputCacheRead: { base: 0.5 },
          output: { base: 25 },
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
          input: {
            base: 0.5,
            tiers: [
              { cost: 0.5, min: 0, max: 200001 },
              { cost: 0.5, min: 200001 },
            ],
          },
          inputCacheRead: {
            base: 0.05,
            tiers: [
              { cost: 0.05, min: 0, max: 200001 },
              { cost: 0.05, min: 200001 },
            ],
          },
          output: {
            base: 3,
            tiers: [
              { cost: 3, min: 0, max: 200001 },
              { cost: 3, min: 200001 },
            ],
          },
        },
      },
      {
        id: "google/gemini-3-pro-preview",
        name: "Gemini 3 Pro",
        maxContextTokens: 1000000,
        maxOutputTokens: 64000,
        pricing: {
          input: {
            base: 2,
            tiers: [
              { cost: 2, min: 0, max: 200001 },
              { cost: 4, min: 200001 },
            ],
          },
          inputCacheRead: {
            base: 0.2,
            tiers: [
              { cost: 0.2, min: 0, max: 200001 },
              { cost: 0.4, min: 200001 },
            ],
          },
          output: {
            base: 12,
            tiers: [
              { cost: 12, min: 0, max: 200001 },
              { cost: 18, min: 200001 },
            ],
          },
        },
      },
      {
        id: "google/gemini-3-pro-image",
        name: "Nano Banana Pro",
        maxContextTokens: 65536,
        maxOutputTokens: 32768,
        pricing: {
          input: { base: 2 },
          output: { base: 120 },
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
          input: {
            base: 0.2,
            tiers: [
              { cost: 0.2, min: 0, max: 128001 },
              { cost: 0.4, min: 128001 },
            ],
          },
          inputCacheRead: { base: 0.05 },
          output: {
            base: 0.5,
            tiers: [
              { cost: 0.5, min: 0, max: 128001 },
              { cost: 1, min: 128001 },
            ],
          },
        },
      },
      {
        id: "xai/grok-4.1-fast-non-reasoning",
        name: "Grok 4.1 Fast Non-Reasoning",
        maxContextTokens: 2000000,
        maxOutputTokens: 30000,
        pricing: {
          input: {
            base: 0.2,
            tiers: [
              { cost: 0.2, min: 0, max: 128001 },
              { cost: 0.4, min: 128001 },
            ],
          },
          inputCacheRead: { base: 0.05 },
          output: {
            base: 0.5,
            tiers: [
              { cost: 0.5, min: 0, max: 128001 },
              { cost: 1, min: 128001 },
            ],
          },
        },
      },
      {
        id: "xai/grok-code-fast-1",
        name: "Grok Code Fast 1",
        maxContextTokens: 256000,
        maxOutputTokens: 256000,
        pricing: {
          input: { base: 0.2 },
          inputCacheRead: { base: 0.02 },
          output: { base: 1.5 },
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
          input: { base: 0.43 },
          inputCacheRead: { base: 0.08 },
          output: { base: 1.75 },
        },
      },
    ],
  },
  moonshotai: {
    name: "Moonshot AI",
    models: [
      {
        id: "moonshotai/kimi-k2",
        name: "Kimi K2",
        maxContextTokens: 131072,
        maxOutputTokens: 16384,
        pricing: {
          input: { base: 0.5 },
          output: { base: 2 },
        },
      },
      {
        id: "moonshotai/kimi-k2-turbo",
        name: "Kimi K2 Turbo",
        maxContextTokens: 256000,
        maxOutputTokens: 16384,
        pricing: {
          input: { base: 2.4 },
          output: { base: 10 },
        },
      },
      {
        id: "moonshotai/kimi-k2-thinking",
        name: "Kimi K2 Thinking",
        maxContextTokens: 216144,
        maxOutputTokens: 216144,
        pricing: {
          input: { base: 0.47 },
          inputCacheRead: { base: 0.141 },
          output: { base: 2 },
        },
      },
      {
        id: "moonshotai/kimi-k2-thinking-turbo",
        name: "Kimi K2 Thinking Turbo",
        maxContextTokens: 262114,
        maxOutputTokens: 262114,
        pricing: {
          input: { base: 1.15 },
          inputCacheRead: { base: 0.15 },
          output: { base: 8 },
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
          input: { base: 0.27 },
          inputCacheRead: { base: 0.216 },
          output: { base: 0.4 },
        },
      },
      {
        id: "deepseek/deepseek-v3.2-thinking",
        name: "DeepSeek V3.2 Thinking",
        maxContextTokens: 128000,
        maxOutputTokens: 64000,
        pricing: {
          input: { base: 0.28 },
          inputCacheRead: { base: 0.028 },
          output: { base: 0.42 },
        },
      },
      {
        id: "deepseek/deepseek-v3.2-exp",
        name: "DeepSeek V3.2 Exp",
        maxContextTokens: 163840,
        maxOutputTokens: 163840,
        pricing: {
          input: { base: 0.27 },
          output: { base: 0.4 },
        },
      },
      {
        id: "deepseek/deepseek-r1",
        name: "DeepSeek R1",
        maxContextTokens: 160000,
        maxOutputTokens: 16384,
        pricing: {
          input: { base: 0.5 },
          inputCacheRead: { base: 0.4 },
          output: { base: 2.15 },
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
          input: { base: 0.071 },
          output: { base: 0.463 },
        },
      },
      {
        id: "alibaba/qwen3-max",
        name: "Qwen3 Max",
        maxContextTokens: 262144,
        maxOutputTokens: 65536,
        pricing: {
          input: {
            base: 0.845,
            tiers: [
              { cost: 0.845, min: 0, max: 32769 },
              { cost: 1.4, min: 32769, max: 131073 },
              { cost: 2.11, min: 131073 },
            ],
          },
          output: {
            base: 3.38,
            tiers: [
              { cost: 3.38, min: 0, max: 32769 },
              { cost: 5.64, min: 32769, max: 131073 },
              { cost: 8.45, min: 131073 },
            ],
          },
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
          input: { base: 0.15 },
          output: { base: 0.6 },
        },
      },
      {
        id: "meta/llama-4-scout",
        name: "Llama 4 Scout",
        maxContextTokens: 131072,
        maxOutputTokens: 8192,
        pricing: {
          input: { base: 0.08 },
          output: { base: 0.3 },
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
          input: { base: 0.3 },
          inputCacheRead: { base: 0.15 },
          output: { base: 1.2 },
        },
      },
      {
        id: "minimax/minimax-m2.1-lightning",
        name: "MiniMax M2.1 Lightning",
        maxContextTokens: 204800,
        maxOutputTokens: 131072,
        pricing: {
          input: { base: 0.3 },
          inputCacheRead: { base: 0.03 },
          output: { base: 2.4 },
        },
      },
    ],
  },
} satisfies Record<string, { name: string; models: Model[] }>

export const creatorIds = Object.keys(creators) as Creator[]
export const allModels = Object.values(creators).flatMap((c) => c.models)
