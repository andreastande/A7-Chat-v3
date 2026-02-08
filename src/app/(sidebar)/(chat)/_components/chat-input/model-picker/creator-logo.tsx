import { Anthropic, DeepSeek, Gemini, Meta, Minimax, Moonshot, OpenAI, Qwen, XAI, ZAI } from "@lobehub/icons"
import type { ComponentProps } from "react"
import type { CreatorId } from "@/lib/models/types"

const creatorLogos: Record<CreatorId, React.FC<ComponentProps<"svg">>> = {
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

export function CreatorLogo({ creator, className }: { creator: CreatorId; className?: string }) {
  const Icon = creatorLogos[creator] ?? creatorLogos.openai
  return <Icon className={className} />
}
