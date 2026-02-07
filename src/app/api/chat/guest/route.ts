import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, createGateway, streamText, type UIMessage } from "ai"
import type { ApiKeyPayload } from "@/lib/api-keys/types"
import { getSystemPrompt, isValidModelId } from "@/lib/models/utils"

interface RequestBody {
  messages: UIMessage[]
  modelId: string
  apiKey: ApiKeyPayload | null
}

export async function POST(req: Request) {
  const { messages, modelId, apiKey }: RequestBody = await req.json()

  if (!apiKey)
    return Response.json(
      { error: "API key missing. Please add one in settings.", code: "API_KEY_MISSING" },
      { status: 401 },
    )
  if (!isValidModelId(modelId)) return new Response("Invalid model ID", { status: 400 })

  // Configure model based on provider
  const provider =
    apiKey.provider === "openrouter" ? createOpenRouter({ apiKey: apiKey.key }) : createGateway({ apiKey: apiKey.key })

  const result = streamText({
    model: provider(modelId),
    messages: await convertToModelMessages(messages),
    system: getSystemPrompt(modelId),
  })

  return result.toUIMessageStreamResponse()
}
