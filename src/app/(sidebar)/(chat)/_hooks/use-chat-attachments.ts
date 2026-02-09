"use client"

import type { FileUIPart } from "ai"
import { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import {
  getAttachmentValidationMessage,
  isImageMediaType,
  validateAttachment,
  type AttachmentValidationErrorCode,
  type DraftUploadResponse,
} from "@/lib/attachments"

type UploadStatus = "uploading" | "ready" | "error"

export type ChatAttachment = {
  id: string
  filename: string
  mediaType: string
  size: number
  status: UploadStatus
  progress: number
  previewUrl: string
  isImage: boolean
  error?: string
  file?: File
  canonicalUrl?: string
  signedUrl?: string
}

interface UseChatAttachmentsOptions {
  chatId: string
  isAuthenticated: boolean
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function revokePreviewUrl(url: string) {
  if (url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

function getUploadErrorMessage(xhr: XMLHttpRequest) {
  const response = xhr.response
  if (response && typeof response === "object" && "error" in response && typeof response.error === "string") {
    return response.error
  }

  if (typeof xhr.responseText === "string" && xhr.responseText) {
    try {
      const parsed = JSON.parse(xhr.responseText)
      if (parsed && typeof parsed.error === "string") return parsed.error
    } catch {
      // ignore parse errors
    }
  }

  return "Failed to upload attachment"
}

export function useChatAttachments({ chatId, isAuthenticated }: UseChatAttachmentsOptions) {
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const activeUploadsRef = useRef(new Map<string, XMLHttpRequest>())
  const previewUrlsRef = useRef(new Set<string>())

  function trackPreviewUrl(url: string) {
    if (url.startsWith("blob:")) {
      previewUrlsRef.current.add(url)
    }
  }

  function revokeTrackedPreviewUrl(url: string) {
    revokePreviewUrl(url)
    previewUrlsRef.current.delete(url)
  }

  useEffect(() => {
    const activeUploads = activeUploadsRef.current
    const previewUrls = previewUrlsRef.current

    return () => {
      activeUploads.forEach((xhr) => xhr.abort())
      activeUploads.clear()

      previewUrls.forEach((url) => revokePreviewUrl(url))
      previewUrls.clear()
    }
  }, [])

  function patchAttachment(id: string, patch: Partial<ChatAttachment>) {
    setAttachments((prev) =>
      prev.map((attachment) => (attachment.id === id ? { ...attachment, ...patch } : attachment)),
    )
  }

  async function removeRemoteDraft(canonicalUrl: string) {
    const res = await fetch("/api/chat/attachments/draft", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ canonicalUrl }),
    })

    if (!res.ok) {
      throw new Error((await res.text()) || "Failed to remove attachment")
    }
  }

  function startUpload(id: string, file: File) {
    const xhr = new XMLHttpRequest()
    activeUploadsRef.current.set(id, xhr)

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable) return
      const progress = Math.round((event.loaded / event.total) * 100)
      patchAttachment(id, { progress })
    }

    xhr.onerror = () => {
      activeUploadsRef.current.delete(id)
      patchAttachment(id, { status: "error", progress: 0, error: "Failed to upload attachment" })
      toast.error("Failed to upload attachment")
    }

    xhr.onabort = () => {
      activeUploadsRef.current.delete(id)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState !== XMLHttpRequest.DONE) return
      activeUploadsRef.current.delete(id)

      if (xhr.status >= 200 && xhr.status < 300) {
        const payload = xhr.response as DraftUploadResponse
        patchAttachment(id, {
          status: "ready",
          progress: 100,
          signedUrl: payload.signedUrl,
          canonicalUrl: payload.canonicalUrl,
          error: undefined,
        })
        return
      }

      const message = getUploadErrorMessage(xhr)
      patchAttachment(id, { status: "error", progress: 0, error: message })
      toast.error(message)
    }

    const formData = new FormData()
    formData.set("chatId", chatId)
    formData.set("file", file)

    xhr.open("POST", "/api/chat/attachments/draft")
    xhr.responseType = "json"
    xhr.send(formData)
  }

  function addFiles(files: File[]) {
    if (files.length === 0) return

    const rejected: AttachmentValidationErrorCode[] = []
    const acceptedForUpload: Array<{ id: string; file: File }> = []

    setAttachments((prev) => {
      const next = [...prev]
      let existingCount = next.length
      let existingTotalBytes = next.reduce((sum, attachment) => sum + attachment.size, 0)

      for (const file of files) {
        const mediaType = file.type || "application/octet-stream"
        const validationError = validateAttachment(
          {
            filename: file.name,
            mediaType,
            size: file.size,
          },
          { existingCount, existingTotalBytes },
        )

        if (validationError) {
          rejected.push(validationError)
          continue
        }

        const id = crypto.randomUUID()
        const isImage = isImageMediaType(mediaType)
        const previewUrl = isImage ? URL.createObjectURL(file) : ""
        trackPreviewUrl(previewUrl)

        next.push({
          id,
          filename: file.name,
          mediaType,
          size: file.size,
          status: isAuthenticated ? "uploading" : "ready",
          progress: isAuthenticated ? 0 : 100,
          previewUrl,
          isImage,
          file: isAuthenticated ? undefined : file,
        })

        acceptedForUpload.push({ id, file })
        existingCount += 1
        existingTotalBytes += file.size
      }

      return next
    })

    rejected.forEach((errorCode) => toast.error(getAttachmentValidationMessage(errorCode)))

    if (isAuthenticated) {
      acceptedForUpload.forEach(({ id, file }) => startUpload(id, file))
    }
  }

  function removeAttachment(id: string) {
    let removedAttachment: ChatAttachment | undefined

    setAttachments((prev) => {
      const next = prev.filter((attachment) => {
        if (attachment.id === id) {
          removedAttachment = attachment
          return false
        }
        return true
      })

      return next
    })

    if (!removedAttachment) return

    const xhr = activeUploadsRef.current.get(id)
    if (xhr) {
      xhr.abort()
      activeUploadsRef.current.delete(id)
    }

    revokeTrackedPreviewUrl(removedAttachment.previewUrl)

    if (isAuthenticated && removedAttachment.canonicalUrl) {
      void removeRemoteDraft(removedAttachment.canonicalUrl).catch((error) => {
        console.error("Failed to remove attachment", error)
        toast.error("Failed to remove attachment")
      })
    }
  }

  function clearAfterSend() {
    setAttachments((prev) => {
      prev.forEach((attachment) => revokeTrackedPreviewUrl(attachment.previewUrl))
      return []
    })
  }

  async function getSendableFileParts(): Promise<FileUIPart[]> {
    if (attachments.some((attachment) => attachment.status === "uploading")) {
      throw new Error("Attachments are still uploading")
    }

    const readyAttachments = attachments.filter((attachment) => attachment.status === "ready")

    if (isAuthenticated) {
      const parts: FileUIPart[] = []

      for (const attachment of readyAttachments) {
        if (!attachment.signedUrl || !attachment.canonicalUrl) continue

        parts.push({
          type: "file",
          filename: attachment.filename,
          mediaType: attachment.mediaType,
          url: attachment.signedUrl,
          providerMetadata: {
            attachment: {
              canonicalUrl: attachment.canonicalUrl,
            },
          },
        })
      }

      return parts
    }

    return Promise.all(
      readyAttachments
        .map((attachment) => attachment.file)
        .filter((file): file is File => Boolean(file))
        .map(async (file) => ({
          type: "file",
          filename: file.name,
          mediaType: file.type || "application/octet-stream",
          url: await readFileAsDataUrl(file),
        })),
    )
  }

  const hasBlockingUploads = attachments.some((attachment) => attachment.status === "uploading")
  const hasReadyAttachments = attachments.some((attachment) => attachment.status === "ready")

  return {
    attachments,
    addFiles,
    removeAttachment,
    clearAfterSend,
    getSendableFileParts,
    hasBlockingUploads,
    hasReadyAttachments,
  }
}
