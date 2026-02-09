import { getCurrentUser } from "@/dal/auth"
import {
  buildDraftAttachmentPath,
  getAttachmentValidationMessage,
  isUserOwnedAttachmentPath,
  parseCanonicalStorageUrl,
  toCanonicalStorageUrl,
  validateAttachment,
} from "@/lib/attachments"
import type { DraftUploadResponse } from "@/lib/attachments"
import { supabaseServer } from "@/lib/supabase/server"
import env from "~/env.config"

// TODO: Add rate limiting to prevent storage abuse by authenticated users
export async function POST(req: Request) {
  const user = await getCurrentUser()
  if (!user) return new Response("Unauthorized", { status: 401 })

  const formData = await req.formData()
  const chatId = formData.get("chatId")
  const file = formData.get("file")

  if (typeof chatId !== "string" || !chatId.trim()) {
    return new Response("Invalid chat id", { status: 400 })
  }

  if (!(file instanceof File)) {
    return new Response("File is required", { status: 400 })
  }

  const mediaType = file.type || "application/octet-stream"
  const validationError = validateAttachment(
    {
      filename: file.name,
      mediaType,
      size: file.size,
    },
    {
      existingCount: 0,
      existingTotalBytes: 0,
    },
  )

  if (validationError) {
    return Response.json({ error: getAttachmentValidationMessage(validationError), code: validationError }, { status: 400 })
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

  const { data: signedData, error: signedError } = await supabaseServer.storage
    .from(env.SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(path, env.SUPABASE_SIGNED_URL_TTL_SECONDS)

  if (signedError || !signedData?.signedUrl) {
    console.error("Failed to sign draft attachment", signedError)
    await supabaseServer.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([path]).catch(() => {})
    return new Response("Failed to sign file", { status: 500 })
  }

  const response: DraftUploadResponse = {
    filename: file.name,
    mediaType,
    size: file.size,
    canonicalUrl: toCanonicalStorageUrl(env.SUPABASE_STORAGE_BUCKET, path),
    signedUrl: signedData.signedUrl,
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

  const parsed = parseCanonicalStorageUrl(canonicalUrl)
  if (!parsed) {
    return new Response("Invalid canonical url", { status: 400 })
  }

  if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) {
    return new Response("Unexpected bucket", { status: 400 })
  }

  if (!isUserOwnedAttachmentPath(parsed.path, user.id)) {
    return new Response("Forbidden", { status: 403 })
  }

  const { error } = await supabaseServer.storage.from(parsed.bucket).remove([parsed.path])

  if (error) {
    console.error("Failed to remove draft attachment", error)
    return new Response("Failed to remove file", { status: 500 })
  }

  return Response.json({ ok: true })
}
