import { devToolsMiddleware } from "@ai-sdk/devtools"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, generateId, streamText, createGateway, wrapLanguageModel } from "ai"
import { getCurrentUser } from "@/dal/auth"
import { getChatWithMessages, insertMessage } from "@/dal/chat"
import { isUserOwnedAttachmentPath, parseCanonicalStorageUrl } from "@/lib/attachments"
import type { ApiKeyPayload } from "@/lib/api-keys/types"
import { getSystemPrompt, isValidModelId } from "@/lib/models/utils"
import { supabaseServer } from "@/lib/supabase/server"
import type { UIMessage } from "@/types/ui-message"
import env from "~/env.config"

interface RequestBody {
  message: UIMessage
  chatId: string
  modelId: string
  apiKey: ApiKeyPayload | null
}

function getCanonicalUrlFromProviderMetadata(part: UIMessage["parts"][number]) {
  if (!("providerMetadata" in part) || !part.providerMetadata || typeof part.providerMetadata !== "object") return null

  const attachment = (part.providerMetadata as Record<string, unknown>).attachment
  if (!attachment || typeof attachment !== "object") return null

  const canonicalUrl = (attachment as Record<string, unknown>).canonicalUrl
  return typeof canonicalUrl === "string" ? canonicalUrl : null
}

function normalizeMessageForStorage(message: UIMessage, userId: string): UIMessage {
  return {
    ...message,
    parts: message.parts.map((part) => {
      if (part.type !== "file") return part

      const canonicalUrl = getCanonicalUrlFromProviderMetadata(part) ?? part.url
      const parsed = parseCanonicalStorageUrl(canonicalUrl)

      if (!parsed) return part
      if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) return part
      if (!isUserOwnedAttachmentPath(parsed.path, userId)) return part

      return {
        ...part,
        url: canonicalUrl,
      }
    }),
  }
}

async function hydrateMessageForModel(message: UIMessage, userId: string): Promise<UIMessage> {
  return {
    ...message,
    parts: await Promise.all(
      message.parts.map(async (part) => {
        if (part.type !== "file") return part

        const parsed = parseCanonicalStorageUrl(part.url)
        if (!parsed) return part
        if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) return part
        if (!isUserOwnedAttachmentPath(parsed.path, userId)) return part

        const { data, error } = await supabaseServer.storage
          .from(parsed.bucket)
          .createSignedUrl(parsed.path, env.SUPABASE_SIGNED_URL_TTL_SECONDS)

        if (error || !data?.signedUrl) {
          console.error("Failed to sign attachment for model", error)
          return part
        }

        return {
          ...part,
          url: data.signedUrl,
        }
      }),
    ),
  }
}

export async function POST(req: Request) {
  const { message, chatId, modelId, apiKey }: RequestBody = await req.json()

  const [user, chat] = await Promise.all([getCurrentUser(), getChatWithMessages(chatId)])

  if (!user) return new Response("Unauthorized", { status: 401 })
  if (!chat) return new Response("Chat not found", { status: 404 })

  // Save user message before validation so it persists even if API key/model is invalid
  const messageForStorage = normalizeMessageForStorage(message, user.id)
  const messageForModel = await hydrateMessageForModel(message, user.id)
  const messages = [...chat.messages, messageForModel]
  await insertMessage(chatId, messageForStorage)

  if (!apiKey)
    return Response.json(
      { error: "API key missing. Please add one in settings.", code: "API_KEY_MISSING" },
      { status: 401 },
    )
  if (!isValidModelId(modelId)) return new Response("Invalid model ID", { status: 400 })

  // Configure model based on provider
  const provider =
    apiKey.provider === "openrouter" ? createOpenRouter({ apiKey: apiKey.key }) : createGateway({ apiKey: apiKey.key })

  const model =
    env.NODE_ENV === "development"
      ? wrapLanguageModel({
          model: provider(modelId),
          middleware: devToolsMiddleware(),
        })
      : provider(modelId)

  const result = streamText({
    model,
    messages: await convertToModelMessages(messages),
    system: getSystemPrompt(modelId),
  })

  result.consumeStream()

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: generateId,
    onFinish: async ({ responseMessage }) => {
      await insertMessage(chatId, responseMessage)
    },
    messageMetadata: ({ part }) => {
      if (part.type === "finish") {
        return {
          modelId,
          totalUsage: part.totalUsage,
        }
      }
    },
  })
}
