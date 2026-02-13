import { and, eq, sql } from "drizzle-orm"
import { getCurrentUser } from "@/dal/auth"
import { isChatAccessible } from "@/dal/chat"
import { db } from "@/db"
import { chat, message } from "@/db/schemas/chat"
import {
  buildDraftAttachmentPath,
  getAttachmentValidationMessage,
  MAX_ATTACHMENT_FILE_SIZE_BYTES,
  toCanonicalStorageUrl,
  validateAttachment,
} from "@/lib/attachments"
import type { DraftUploadResponse } from "@/lib/attachments"
import { enforceAttachmentUploadRateLimit } from "@/lib/attachments/rate-limit"
import { validateOwnedCanonicalAttachmentUrl } from "@/lib/attachments/server"
import { supabaseServer } from "@/lib/supabase/server"
import env from "~/env.config"

const MAX_DRAFT_UPLOAD_MULTIPART_OVERHEAD_BYTES = 1024 * 1024
const MAX_DRAFT_UPLOAD_REQUEST_BYTES = MAX_ATTACHMENT_FILE_SIZE_BYTES + MAX_DRAFT_UPLOAD_MULTIPART_OVERHEAD_BYTES

function parseContentLength(headerValue: string | null): number | null {
  if (!headerValue || !/^\d+$/.test(headerValue)) return null
  const parsed = Number(headerValue)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) return null
  return parsed
}

export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const contentType = req.headers.get("content-type") ?? ""
  if (!contentType.toLowerCase().startsWith("multipart/form-data")) {
    return new Response("Unsupported content type", { status: 415 })
  }

  const contentLength = parseContentLength(req.headers.get("content-length"))
  if (contentLength === null) {
    return new Response("Missing or invalid Content-Length", { status: 411 })
  }

  if (contentLength > MAX_DRAFT_UPLOAD_REQUEST_BYTES) {
    return Response.json({ error: "Upload request is too large", code: "REQUEST_TOO_LARGE" }, { status: 413 })
  }

  const formData = await req.formData()
  const chatId = formData.get("chatId")
  const file = formData.get("file")

  if (typeof chatId !== "string" || !chatId.trim()) {
    return new Response("Invalid chat id", { status: 400 })
  }

  if (!(await isChatAccessible(chatId.trim()))) {
    return new Response("Forbidden", { status: 403 })
  }

  if (!(file instanceof File)) {
    return new Response("File is required", { status: 400 })
  }

  const mediaType = file.type || "application/octet-stream"
  const validationError = validateAttachment(
    {
      mediaType,
      size: file.size,
    },
    {
      existingCount: 0,
      existingTotalBytes: 0,
    },
  )

  if (validationError) {
    return Response.json(
      { error: getAttachmentValidationMessage(validationError), code: validationError },
      { status: 400 },
    )
  }

  const rateLimitResult = await enforceAttachmentUploadRateLimit({
    userId: user.id,
    fileSizeBytes: file.size,
  })

  if (!rateLimitResult.ok) {
    return Response.json(
      {
        error: "Too many attachment uploads. Please try again soon.",
        code: "RATE_LIMITED",
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfterSeconds),
        },
      },
    )
  }

  const path = buildDraftAttachmentPath({
    userId: user.id,
    chatId,
    filename: file.name,
  })

  const { error: uploadError } = await supabaseServer.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(path, file, {
    contentType: mediaType,
    upsert: false,
    cacheControl: "3600",
  })

  if (uploadError) {
    console.error("Failed to upload draft attachment", uploadError)
    return new Response("Failed to upload file", { status: 500 })
  }

  const response: DraftUploadResponse = {
    filename: file.name,
    mediaType,
    size: file.size,
    canonicalUrl: toCanonicalStorageUrl(env.SUPABASE_STORAGE_BUCKET, path),
  }

  return Response.json(response)
}

export async function DELETE(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const body = await req.json().catch(() => null)
  const canonicalUrl = body?.canonicalUrl

  if (typeof canonicalUrl !== "string" || !canonicalUrl) {
    return new Response("Invalid canonical url", { status: 400 })
  }

  const validation = validateOwnedCanonicalAttachmentUrl(canonicalUrl, user.id)
  if (!validation.ok && validation.code === "invalid") {
    return new Response("Invalid canonical url", { status: 400 })
  }
  if (!validation.ok && validation.code === "unexpected_bucket") {
    return new Response("Unexpected bucket", { status: 400 })
  }
  if (!validation.ok && validation.code === "forbidden") {
    return new Response("Forbidden", { status: 403 })
  }
  if (!validation.ok) return new Response("Invalid canonical url", { status: 400 })

  const [referencedMessage] = await db
    .select({ id: message.id })
    .from(message)
    .innerJoin(chat, eq(chat.id, message.chatId))
    .where(
      and(
        eq(chat.userId, user.id),
        sql`exists (
          select 1
          from jsonb_array_elements(${message.parts}) as part
          where part->>'type' = 'file'
            and (
              part->>'url' = ${canonicalUrl}
              or part->'providerMetadata'->'attachment'->>'canonicalUrl' = ${canonicalUrl}
            )
        )`,
      ),
    )
    .limit(1)

  if (referencedMessage) {
    return new Response("Cannot delete attachment that is already used in a sent message", { status: 409 })
  }

  const { error } = await supabaseServer.storage.from(validation.bucket).remove([validation.path])

  if (error) {
    console.error("Failed to remove draft attachment", error)
    return new Response("Failed to remove file", { status: 500 })
  }

  return Response.json({ ok: true })
}
