"use client"

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store"
import { ArrowUp, Square } from "lucide-react"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ALLOWED_ATTACHMENT_MEDIA_TYPES } from "@/lib/attachments"
import { cn } from "@/lib/utils"
import type { ChatAttachment } from "../../_hooks/use-chat-attachments"
import { useFocusOnType } from "../../_hooks/use-focus-on-type"
import { AttachmentPreview } from "./attachment-preview"
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
        onPaste={(e) => {
          const files = Array.from(e.clipboardData.items)
            .filter((item) => item.kind === "file")
            .map((item) => item.getAsFile())
            .filter((file): file is File => Boolean(file))

          if (files.length === 0) return

          e.preventDefault()
          onAddFiles(files)
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            e.currentTarget.form?.requestSubmit()
          }
        }}
      />
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <ChatInputActions onAddFiles={() => fileInputRef.current?.click()} />
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
