import "server-only"
import { sql } from "drizzle-orm"
import { db } from "@/db"
import { attachmentUploadRateLimitWindow } from "@/db/schemas/chat"

const ATTACHMENT_UPLOAD_RATE_LIMIT_SCOPE = "draft_upload_v1"

const ATTACHMENT_UPLOAD_LIMIT_WINDOWS = [
  {
    windowSeconds: 60,
    maxUploads: 30,
    maxBytes: 100 * 1024 * 1024,
  },
  {
    windowSeconds: 60 * 60,
    maxUploads: 300,
    maxBytes: 700 * 1024 * 1024,
  },
  {
    windowSeconds: 60 * 60 * 24,
    maxUploads: 1200,
    maxBytes: 1536 * 1024 * 1024,
  },
] as const

class AttachmentRateLimitExceededError extends Error {
  readonly retryAfterSeconds: number

  constructor(retryAfterSeconds: number) {
    super("Attachment upload rate limit exceeded")
    this.name = "AttachmentRateLimitExceededError"
    this.retryAfterSeconds = retryAfterSeconds
  }
}

function getWindowStart(nowMs: number, windowSeconds: number): Date {
  const windowMs = windowSeconds * 1000
  return new Date(Math.floor(nowMs / windowMs) * windowMs)
}

function getRetryAfterSeconds(nowMs: number, windowSeconds: number): number {
  const windowMs = windowSeconds * 1000
  const elapsedInWindow = nowMs % windowMs
  return Math.max(1, Math.ceil((windowMs - elapsedInWindow) / 1000))
}

type AttachmentUploadRateLimitResult =
  | {
      ok: true
    }
  | {
      ok: false
      retryAfterSeconds: number
    }

export async function enforceAttachmentUploadRateLimit({
  userId,
  fileSizeBytes,
}: {
  userId: string
  fileSizeBytes: number
}): Promise<AttachmentUploadRateLimitResult> {
  const now = new Date()
  const nowMs = now.getTime()

  try {
    await db.transaction(async (tx) => {
      for (const window of ATTACHMENT_UPLOAD_LIMIT_WINDOWS) {
        const windowStart = getWindowStart(nowMs, window.windowSeconds)

        const rows = await tx
          .insert(attachmentUploadRateLimitWindow)
          .values({
            scope: ATTACHMENT_UPLOAD_RATE_LIMIT_SCOPE,
            subject: userId,
            windowStart,
            uploadCount: 1,
            totalBytes: fileSizeBytes,
            updatedAt: now,
          })
          .onConflictDoUpdate({
            target: [
              attachmentUploadRateLimitWindow.scope,
              attachmentUploadRateLimitWindow.subject,
              attachmentUploadRateLimitWindow.windowStart,
            ],
            set: {
              uploadCount: sql`${attachmentUploadRateLimitWindow.uploadCount} + 1`,
              totalBytes: sql`${attachmentUploadRateLimitWindow.totalBytes} + ${fileSizeBytes}`,
              updatedAt: now,
            },
            setWhere: sql`
              ${attachmentUploadRateLimitWindow.uploadCount} + 1 <= ${window.maxUploads}
              and ${attachmentUploadRateLimitWindow.totalBytes} + ${fileSizeBytes} <= ${window.maxBytes}
            `,
          })
          .returning({ scope: attachmentUploadRateLimitWindow.scope })

        if (rows.length === 0) {
          throw new AttachmentRateLimitExceededError(getRetryAfterSeconds(nowMs, window.windowSeconds))
        }
      }
    })
  } catch (error) {
    if (error instanceof AttachmentRateLimitExceededError) {
      return { ok: false, retryAfterSeconds: error.retryAfterSeconds }
    }

    throw error
  }

  return { ok: true }
}
