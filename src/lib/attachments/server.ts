import "server-only"
import { supabaseServer } from "@/lib/supabase/server"
import type { UIMessage } from "@/types/ui-message"
import env from "~/env.config"
import { isCanonicalStorageUrl, isUserOwnedAttachmentPath, parseCanonicalStorageUrl } from "./storage"

export type CanonicalAttachmentValidationResult =
  | {
      ok: true
      bucket: string
      path: string
    }
  | {
      ok: false
      code: "invalid" | "unexpected_bucket" | "forbidden"
    }

export function validateOwnedCanonicalAttachmentUrl(
  canonicalUrl: string,
  userId: string,
): CanonicalAttachmentValidationResult {
  const parsed = parseCanonicalStorageUrl(canonicalUrl)
  if (!parsed) return { ok: false, code: "invalid" }
  if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) return { ok: false, code: "unexpected_bucket" }
  if (!isUserOwnedAttachmentPath(parsed.path, userId)) return { ok: false, code: "forbidden" }

  return {
    ok: true,
    bucket: parsed.bucket,
    path: parsed.path,
  }
}

export async function hydrateCanonicalAttachmentUrls(
  messages: UIMessage[],
  { userId }: { userId: string },
): Promise<UIMessage[]> {
  const targets: Array<{ msgIdx: number; partIdx: number; path: string }> = []

  for (let mi = 0; mi < messages.length; mi++) {
    for (let pi = 0; pi < messages[mi].parts.length; pi++) {
      const part = messages[mi].parts[pi]
      if (part.type !== "file" || !isCanonicalStorageUrl(part.url)) continue

      const validation = validateOwnedCanonicalAttachmentUrl(part.url, userId)
      if (!validation.ok) continue

      targets.push({
        msgIdx: mi,
        partIdx: pi,
        path: validation.path,
      })
    }
  }

  if (targets.length === 0) return messages

  const { data, error } = await supabaseServer.storage.from(env.SUPABASE_STORAGE_BUCKET).createSignedUrls(
    targets.map((target) => target.path),
    env.SUPABASE_SIGNED_URL_TTL_SECONDS,
  )

  if (error || !data) {
    console.error("Failed to batch sign attachment URLs", error)
    return messages
  }

  const signedUrlMap = new Map<string, string>()
  for (let i = 0; i < targets.length; i++) {
    const item = data[i]
    const key = `${targets[i].msgIdx}:${targets[i].partIdx}`
    if (item?.error || !item?.signedUrl) continue
    signedUrlMap.set(key, item.signedUrl)
  }

  return messages.map((message, mi) => ({
    ...message,
    parts: message.parts.map((part, pi) => {
      if (part.type !== "file") return part

      const signedUrl = signedUrlMap.get(`${mi}:${pi}`)
      if (!signedUrl) return part

      const attachmentMetadata =
        part.providerMetadata?.attachment && typeof part.providerMetadata.attachment === "object"
          ? part.providerMetadata.attachment
          : {}

      return {
        ...part,
        url: signedUrl,
        providerMetadata: {
          ...part.providerMetadata,
          attachment: { ...attachmentMetadata, canonicalUrl: part.url },
        },
      }
    }),
  }))
}
