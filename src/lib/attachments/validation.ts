import {
  ALLOWED_ATTACHMENT_MEDIA_TYPE_SET,
  MAX_ATTACHMENT_FILE_SIZE_BYTES,
  MAX_ATTACHMENTS_PER_MESSAGE,
  MAX_TOTAL_ATTACHMENT_BYTES,
} from "./constants"

export type AttachmentCandidate = {
  mediaType: string
  size: number
}

export type AttachmentValidationErrorCode =
  | "unsupported_type"
  | "file_too_large"
  | "too_many_files"
  | "total_size_exceeded"
  | "empty_file"

export type AttachmentValidationContext = {
  existingCount: number
  existingTotalBytes: number
}

export function validateAttachment(
  candidate: AttachmentCandidate,
  context: AttachmentValidationContext,
): AttachmentValidationErrorCode | null {
  if (!candidate.size || candidate.size <= 0) return "empty_file"
  if (!ALLOWED_ATTACHMENT_MEDIA_TYPE_SET.has(candidate.mediaType)) return "unsupported_type"
  if (candidate.size > MAX_ATTACHMENT_FILE_SIZE_BYTES) return "file_too_large"
  if (context.existingCount + 1 > MAX_ATTACHMENTS_PER_MESSAGE) return "too_many_files"
  if (context.existingTotalBytes + candidate.size > MAX_TOTAL_ATTACHMENT_BYTES) return "total_size_exceeded"

  return null
}

export function getAttachmentValidationMessage(errorCode: AttachmentValidationErrorCode): string {
  switch (errorCode) {
    case "unsupported_type":
      return "Unsupported file type"
    case "file_too_large":
      return "File is too large (max 10MB per file)"
    case "too_many_files":
      return "Too many attachments (max 10 files per message)"
    case "total_size_exceeded":
      return "Attachments exceed total size limit (30MB per message)"
    case "empty_file":
      return "File is empty"
  }
}

export function isImageMediaType(mediaType: string) {
  return mediaType.startsWith("image/")
}
