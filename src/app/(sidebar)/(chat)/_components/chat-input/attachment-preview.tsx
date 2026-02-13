"use client"

import { FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChatAttachment } from "../../_hooks/use-chat-attachments"

export function AttachmentPreview({
  attachment,
  onRemove,
}: {
  attachment: ChatAttachment
  onRemove: (id: string) => void
}) {
  const extension = attachment.filename.split(".").at(-1)?.slice(0, 4)?.toUpperCase() || "FILE"

  return attachment.isImage ? (
    <div className="relative size-18 overflow-hidden rounded-lg border border-input bg-muted/30">
      {/* oxlint-disable-next-line eslint-plugin-next/no-img-element */}
      <img src={attachment.previewUrl} alt="Attachment" className="size-full object-cover" draggable={false} />
      <Button
        type="button"
        size="icon-xs"
        variant="secondary"
        className="absolute top-1 right-1 size-5 rounded-full bg-black/55 text-white hover:bg-black/70"
        onClick={() => onRemove(attachment.id)}
      >
        <X className="size-3" />
      </Button>
      {attachment.status === "uploading" && (
        <div className="absolute inset-x-1 bottom-1 h-1 rounded-full bg-black/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${attachment.progress}%` }} />
        </div>
      )}
      {attachment.status === "error" && (
        <div className="text-destructive-foreground absolute inset-x-1 bottom-1 rounded-sm bg-destructive/85 px-1 py-0.5 text-[10px] font-medium">
          Upload failed
        </div>
      )}
    </div>
  ) : (
    <div className="relative flex min-w-52 items-center gap-3 rounded-lg border border-input bg-muted/30 py-2 pr-8 pl-2.5">
      <div className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-background text-[10px] font-semibold tracking-wide text-muted-foreground">
        {extension}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{attachment.filename}</p>
        {attachment.status === "uploading" && (
          <div className="mt-1 h-1.5 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${attachment.progress}%` }} />
          </div>
        )}
        {attachment.status === "error" && <p className="mt-0.5 text-xs text-destructive">{attachment.error}</p>}
      </div>
      <FileText className="size-3.5 text-muted-foreground" />
      <Button
        type="button"
        size="icon-xs"
        variant="ghost"
        className="absolute top-1.5 right-1.5 size-5"
        onClick={() => onRemove(attachment.id)}
      >
        <X className="size-3" />
      </Button>
    </div>
  )
}
