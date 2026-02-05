import type { UIMessage as BaseUIMessage, LanguageModelUsage } from "ai"

export type MessageMetadata = {
  modelId: string
  totalUsage: LanguageModelUsage
}

export type UIMessage = BaseUIMessage<MessageMetadata>
