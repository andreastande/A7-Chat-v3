import { Anthropic, DeepSeek, Gemini, Meta, Minimax, Moonshot, OpenAI, Qwen, XAI, ZAI } from "@lobehub/icons"
import type { ComponentProps } from "react"

const providerLogos: Record<string, React.FC<ComponentProps<"svg">>> = {
  openai: OpenAI,
  anthropic: Anthropic,
  google: Gemini,
  xai: XAI,
  zai: ZAI,
  moonshotai: Moonshot,
  deepseek: DeepSeek,
  alibaba: Qwen,
  meta: Meta,
  minimax: Minimax,
}

export function ProviderLogo({ provider, className }: { provider: string; className?: string }) {
  const Icon = providerLogos[provider] ?? providerLogos.openai
  return <Icon className={className} />
}
