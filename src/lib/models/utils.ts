import dedent from "dedent"
import { allModels, creators } from "./creators"
import type { Creator, CreatorId, Model } from "./types"

export const DEFAULT_MODEL_ID = "openai/gpt-5.2"

export function isValidModelId(id: string) {
  return allModels.some((m) => m.id === id)
}

export function getValidModelId(id: string | undefined) {
  return id && isValidModelId(id) ? id : DEFAULT_MODEL_ID
}

export function getModelsByCreator(creator: CreatorId) {
  return creators[creator].models
}

export function getCreator(creator: CreatorId): Creator {
  return creators[creator]
}

export function getModel(modelId: string): Model | undefined {
  return allModels.find((m) => m.id === modelId)
}

export function getSystemPrompt(modelId: string) {
  return dedent`
    If the user asks who you are, you are ${getModel(modelId)?.name} \
    from ${getCreator(modelId.split("/")[0] as CreatorId).name}.

    Use double dollar signs ($$) to delimit mathematical expressions. Do not use \
    single dollar signs ($) for math to avoid conflicts with currency symbols in \
    regular text.
  `
}
