"use client"

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store"
import { ArrowUp, FileText, Square, X } from "lucide-react"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ALLOWED_ATTACHMENT_MEDIA_TYPES } from "@/lib/attachments"
import { cn } from "@/lib/utils"
import type { ChatAttachment } from "../../_hooks/use-chat-attachments"
import { useFocusOnType } from "../../_hooks/use-focus-on-type"
import { ChatInputActions } from "./chat-input-actions"
import { ModelPicker } from "./model-picker"
import { TokenUsage } from "./token-usage"

interface ChatInputProps {
  className?: string
  sendMessage: (msg: string) => void
  attachments: ChatAttachment[]
  onAddFiles: (files: File[]) => void
  onRemoveAttachment: (id: string) => void
  hasReadyAttachments: boolean
  hasBlockingUploads: boolean
}

function AttachmentPreview({ attachment, onRemove }: { attachment: ChatAttachment; onRemove: (id: string) => void }) {
  const extension = attachment.filename.split(".").at(-1)?.slice(0, 4)?.toUpperCase() || "FILE"

  return attachment.isImage ? (
    <div className="relative size-18 overflow-hidden rounded-lg border border-input bg-muted/30">
      {/* oxlint-disable-next-line eslint-plugin-next/no-img-element */}
      <img
        src={attachment.previewUrl || attachment.signedUrl}
        alt="Attachment"
        className="size-full object-cover"
        draggable={false}
      />
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

export function ChatInput({
  className,
  sendMessage,
  attachments,
  onAddFiles,
  onRemoveAttachment,
  hasReadyAttachments,
  hasBlockingUploads,
}: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  useFocusOnType(textareaRef, setInput)

  const status = useChatStatus()
  const { stop } = useChatActions()

  const canSend = status === "ready" && !hasBlockingUploads && Boolean(input.trim() || hasReadyAttachments)
  const canStop = status === "submitted" || status === "streaming"

  function openFilePicker() {
    fileInputRef.current?.click()
  }

  function handleSubmit() {
    if (canSend) {
      sendMessage(input.trim())
      setInput("")
    } else if (canStop) {
      stop() // oxlint-disable-line
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      onClick={(e) => {
        // oxfmt-ignore
        const excludedSlots = ["tooltip-content", "tooltip-trigger", "popover-content", "popover-trigger", "dropdown-menu-content", "hover-card-content"]
        if (!excludedSlots.some((slot) => (e.target as HTMLElement).closest(`[data-slot="${slot}"]`))) {
          textareaRef.current?.focus()
        }
      }}
      className={cn(
        "cursor-text rounded-xl border border-input bg-background p-3 shadow-xs dark:bg-[#141416]",
        className,
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={ALLOWED_ATTACHMENT_MEDIA_TYPES.join(",")}
        className="hidden"
        onChange={(event) => {
          const files = event.target.files ? Array.from(event.target.files) : []
          if (files.length > 0) onAddFiles(files)
          event.target.value = ""
        }}
      />

      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 px-1 pt-1">
          {attachments.map((attachment) => (
            <AttachmentPreview key={attachment.id} attachment={attachment} onRemove={onRemoveAttachment} />
          ))}
        </div>
      )}

      <TextareaAutosize
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        placeholder="Ask anything"
        minRows={2}
        maxRows={11}
        className="w-full resize-none pt-2 pl-2 outline-none"
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "d") {
            e.preventDefault()
            openFilePicker()
            return
          }

          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <ChatInputActions onAddFiles={openFilePicker} />
          <Separator orientation="vertical" className="h-4 self-center!" />
          <ModelPicker />
        </div>
        <div className="flex items-center gap-2">
          <TokenUsage />
          <Button type="submit" size="icon-sm" disabled={!(canSend || canStop)}>
            {canStop ? <Square /> : <ArrowUp />}
          </Button>
        </div>
      </div>
    </form>
  )
}
