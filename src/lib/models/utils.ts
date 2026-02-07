import dedent from "dedent"
import { allModels, creators } from "./creators"
import type { Creator } from "./types"

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
