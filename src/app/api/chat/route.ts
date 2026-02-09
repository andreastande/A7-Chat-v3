import { devToolsMiddleware } from "@ai-sdk/devtools"
import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { convertToModelMessages, generateId, streamText, createGateway, wrapLanguageModel } from "ai"
import { getCurrentUser } from "@/dal/auth"
import { getChatWithMessages, insertMessage } from "@/dal/chat"
import {
  ALLOWED_ATTACHMENT_MEDIA_TYPE_SET,
  MAX_ATTACHMENTS_PER_MESSAGE,
  getAttachmentValidationMessage,
  isCanonicalStorageUrl,
  isUserOwnedAttachmentPath,
  parseCanonicalStorageUrl,
  validateAttachment,
} from "@/lib/attachments"
import { signCanonicalAttachmentUrl } from "@/lib/attachments/server"
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

type NormalizedMessageResult =
  | { ok: true; message: UIMessage }
  | { ok: false; error: string; code: string }

function getCanonicalUrlFromProviderMetadata(part: UIMessage["parts"][number]) {
  if (!("providerMetadata" in part) || !part.providerMetadata || typeof part.providerMetadata !== "object") return null

  const attachment = (part.providerMetadata as Record<string, unknown>).attachment
  if (!attachment || typeof attachment !== "object") return null

  const canonicalUrl = (attachment as Record<string, unknown>).canonicalUrl
  return typeof canonicalUrl === "string" ? canonicalUrl : null
}

async function normalizeAndValidateAttachments(message: UIMessage, userId: string): Promise<NormalizedMessageResult> {
  const normalizedParts: UIMessage["parts"] = []
  const pendingFiles: Array<{
    partIndex: number
    canonicalUrl: string
    mediaType: string
    filename: string | undefined
    bucket: string
    path: string
  }> = []

  // First pass: extract canonical URLs, validate shape/bucket/ownership, fast-fail on type/count
  for (const part of message.parts) {
    if (part.type !== "file") {
      normalizedParts.push(part)
      continue
    }

    if (pendingFiles.length + 1 > MAX_ATTACHMENTS_PER_MESSAGE) {
      return { ok: false, error: getAttachmentValidationMessage("too_many_files"), code: "too_many_files" }
    }

    if (!ALLOWED_ATTACHMENT_MEDIA_TYPE_SET.has(part.mediaType)) {
      return { ok: false, error: getAttachmentValidationMessage("unsupported_type"), code: "unsupported_type" }
    }

    const canonicalUrl = getCanonicalUrlFromProviderMetadata(part) ?? part.url
    const parsed = parseCanonicalStorageUrl(canonicalUrl)

    if (!parsed) {
      return { ok: false, error: "Invalid attachment reference", code: "ATTACHMENT_REFERENCE_INVALID" }
    }
    if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) {
      return { ok: false, error: "Unexpected attachment bucket", code: "ATTACHMENT_BUCKET_INVALID" }
    }
    if (!isUserOwnedAttachmentPath(parsed.path, userId)) {
      return { ok: false, error: "Forbidden attachment reference", code: "ATTACHMENT_FORBIDDEN" }
    }

    pendingFiles.push({
      partIndex: normalizedParts.length,
      canonicalUrl,
      mediaType: part.mediaType,
      filename: part.filename,
      bucket: parsed.bucket,
      path: parsed.path,
    })

    normalizedParts.push({ ...part, url: canonicalUrl })
  }

  if (pendingFiles.length === 0) {
    return { ok: true, message: { ...message, parts: normalizedParts } }
  }

  // Parallel fetch: verify all attachments exist and get actual metadata
  const infoResults = await Promise.all(
    pendingFiles.map(({ bucket, path }) => supabaseServer.storage.from(bucket).info(path)),
  )

  let existingCount = 0
  let existingTotalBytes = 0

  for (let i = 0; i < pendingFiles.length; i++) {
    const pending = pendingFiles[i]
    const { data, error } = infoResults[i]

    if (error || !data) {
      return { ok: false, error: "Attachment not found", code: "ATTACHMENT_NOT_FOUND" }
    }

    const actualMediaType = data.contentType ?? pending.mediaType
    const size = data.size ?? 0

    const validationError = validateAttachment(
      { filename: pending.filename ?? data.name ?? "attachment", mediaType: actualMediaType, size },
      { existingCount, existingTotalBytes },
    )

    if (validationError) {
      return { ok: false, error: getAttachmentValidationMessage(validationError), code: validationError }
    }

    if (pending.mediaType !== actualMediaType) {
      return { ok: false, error: "Attachment metadata mismatch", code: "ATTACHMENT_METADATA_MISMATCH" }
    }

    existingCount += 1
    existingTotalBytes += size
  }

  return { ok: true, message: { ...message, parts: normalizedParts } }
}

async function hydrateMessageForModel(message: UIMessage, userId: string): Promise<UIMessage> {
  return {
    ...message,
    parts: await Promise.all(
      message.parts.map(async (part) => {
        if (part.type !== "file") return part
        if (!isCanonicalStorageUrl(part.url)) return part

        const signedUrl = await signCanonicalAttachmentUrl(part.url, userId)
        if (!signedUrl) return part

        return { ...part, url: signedUrl }
      }),
    ),
  }
}

export async function POST(req: Request) {
  const { message, chatId, modelId, apiKey }: RequestBody = await req.json()

  const [user, chat] = await Promise.all([getCurrentUser(), getChatWithMessages(chatId)])

  if (!user) return new Response("Unauthorized", { status: 401 })
  if (!chat) return new Response("Chat not found", { status: 404 })

  const normalized = await normalizeAndValidateAttachments(message, user.id)
  if (!normalized.ok) {
    return Response.json({ error: normalized.error, code: normalized.code }, { status: 400 })
  }

  // Save user message before API key/model validation so it persists even if API key/model is invalid
  const messageForStorage = normalized.message
  const messageForModel = await hydrateMessageForModel(messageForStorage, user.id)
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
