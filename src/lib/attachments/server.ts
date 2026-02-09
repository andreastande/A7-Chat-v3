import "server-only"

import { supabaseServer } from "@/lib/supabase/server"
import env from "~/env.config"
import { isUserOwnedAttachmentPath, parseCanonicalStorageUrl } from "./storage"

/**
 * Parse and sign a canonical attachment URL, returning a short-lived signed URL.
 * Returns null if the URL is invalid, belongs to the wrong bucket, or isn't owned by the user.
 */
export async function signCanonicalAttachmentUrl(
  canonicalUrl: string,
  userId: string,
): Promise<string | null> {
  const parsed = parseCanonicalStorageUrl(canonicalUrl)
  if (!parsed) return null
  if (parsed.bucket !== env.SUPABASE_STORAGE_BUCKET) return null
  if (!isUserOwnedAttachmentPath(parsed.path, userId)) return null

  const { data, error } = await supabaseServer.storage
    .from(parsed.bucket)
    .createSignedUrl(parsed.path, env.SUPABASE_SIGNED_URL_TTL_SECONDS)

  if (error || !data?.signedUrl) {
    console.error("Failed to sign attachment URL", error)
    return null
  }

  return data.signedUrl
}
