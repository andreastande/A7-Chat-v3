import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, generateId, streamText, type UIMessage, createGateway } from "ai"
import { getCurrentUser } from "@/dal/auth"
import { getChatWithMessages, insertMessage } from "@/dal/chat"
import type { ApiKeyPayload } from "@/lib/api-keys/types"
import { getSystemPrompt, isValidModelId } from "@/lib/models"

interface RequestBody {
  message: UIMessage
  chatId: string
  modelId: string
  apiKey: ApiKeyPayload | null
}

export async function POST(req: Request) {
  const { message, chatId, modelId, apiKey }: RequestBody = await req.json()

  const [user, chat] = await Promise.all([getCurrentUser(), getChatWithMessages(chatId)])

  if (!user) return new Response("Unauthorized", { status: 401 })
  if (!chat) return new Response("Chat not found", { status: 404 })

  // Save user message before validation so it persists even if API key/model is invalid
  const messages = [...chat.messages, message]
  await insertMessage({ chatId, ...message })

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

  result.consumeStream()

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: async ({ responseMessage }) => {
      await insertMessage({ chatId, ...responseMessage })
    },
  })
}
