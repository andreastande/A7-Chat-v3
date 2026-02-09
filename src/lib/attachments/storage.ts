const SUPABASE_URL_PREFIX = "supabase://"

export function sanitizeFilename(filename: string): string {
  const trimmed = filename.trim() || "file"
  const withoutPathSeparators = trimmed.replace(/[\\/]/g, "_")
  return withoutPathSeparators
    .replace(/[^a-zA-Z0-9._ -]/g, "_")
    .replace(/\s+/g, " ")
    .slice(0, 120)
}

function sanitizePathSegment(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_")
}

export function buildDraftAttachmentPath({
  userId,
  chatId,
  filename,
}: {
  userId: string
  chatId: string
  filename: string
}) {
  return `users/${sanitizePathSegment(userId)}/drafts/${sanitizePathSegment(chatId)}/${crypto.randomUUID()}-${sanitizeFilename(filename)}`
}

export function toCanonicalStorageUrl(bucket: string, path: string): string {
  return `${SUPABASE_URL_PREFIX}${bucket}/${encodeURIComponent(path)}`
}

export function parseCanonicalStorageUrl(url: string): { bucket: string; path: string } | null {
  if (!url.startsWith(SUPABASE_URL_PREFIX)) return null

  const body = url.slice(SUPABASE_URL_PREFIX.length)
  const firstSlash = body.indexOf("/")
  if (firstSlash === -1) return null

  const bucket = body.slice(0, firstSlash)
  const encodedPath = body.slice(firstSlash + 1)
  if (!bucket || !encodedPath) return null

  try {
    return { bucket, path: decodeURIComponent(encodedPath) }
  } catch {
    return null
  }
}

export function isCanonicalStorageUrl(url: string) {
  return url.startsWith(SUPABASE_URL_PREFIX)
}

export function isUserOwnedAttachmentPath(path: string, userId: string) {
  return path.startsWith(`users/${sanitizePathSegment(userId)}/`)
}
