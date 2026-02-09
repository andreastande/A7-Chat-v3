export const MAX_ATTACHMENTS_PER_MESSAGE = 10
export const MAX_ATTACHMENT_FILE_SIZE_BYTES = 10 * 1024 * 1024
export const MAX_TOTAL_ATTACHMENT_BYTES = 30 * 1024 * 1024

export const ALLOWED_ATTACHMENT_MEDIA_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
] as const

export const ALLOWED_ATTACHMENT_MEDIA_TYPE_SET = new Set<string>(ALLOWED_ATTACHMENT_MEDIA_TYPES)

export const DEFAULT_ATTACHMENT_BUCKET = "chat-attachments"
export const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60
