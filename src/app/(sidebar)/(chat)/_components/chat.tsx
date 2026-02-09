"use client"

import { useChat } from "@ai-sdk-tools/store"
import { DefaultChatTransport } from "ai"
import { FileUp } from "lucide-react"
import { toast } from "sonner"
import { generateChatTitle } from "@/actions/chat"
import { useApiKeysStore } from "@/app/(sidebar)/_components/providers/api-keys-provider"
import { useChatHistoryStore } from "@/app/(sidebar)/_components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { UIMessage } from "@/types/ui-message"
import { useChatAttachments } from "../_hooks/use-chat-attachments"
import { useChatSession } from "../_hooks/use-chat-session"
import { useFileDragDrop } from "../_hooks/use-file-drag-drop"
import { useScrollOnMount } from "../_hooks/use-scroll-on-mount"
import { useScrollOnSubmit } from "../_hooks/use-scroll-on-submit"
import { ChatInput } from "./chat-input"
import { ErrorMessage } from "./error-message"
import { Message } from "./message"
import { useSelectedModelStore } from "./providers/selected-model-provider"

interface ChatProps {
  chatId?: string
  initialMessages?: UIMessage[]
}

function DropOverlay() {
  return (
    <div className="pointer-events-none absolute inset-8 z-50 grid place-items-center rounded-2xl border-2 border-dashed border-primary/50 bg-primary/10 backdrop-blur-[1px]">
      <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm shadow-sm">
        <FileUp className="size-4 text-primary" />
        Drop files to attach
      </div>
    </div>
  )
}

export function Chat({ chatId, initialMessages = [] }: ChatProps) {
  const session = useSession()
  const { id, navigateToChat } = useChatSession(chatId)

  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const getActiveKeyPayload = useApiKeysStore((s) => s.getActiveKeyPayload)
  const addChat = useChatHistoryStore((s) => s.addChat)
  const touchChat = useChatHistoryStore((s) => s.touchChat)
  const renameChat = useChatHistoryStore((s) => s.renameChat)

  const {
    attachments,
    addFiles,
    removeAttachment,
    clearAfterSend,
    getSendableFileParts,
    hasBlockingUploads,
    hasReadyAttachments,
  } = useChatAttachments({
    chatId: id,
    isAuthenticated: Boolean(session),
  })

  const { messages, status, error, sendMessage } = useChat<UIMessage>({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: session ? "/api/chat" : "/api/chat/guest",
      prepareSendMessagesRequest({ messages, id: chatId, body }) {
        return session ? { body: { message: messages.at(-1), chatId, ...body } } : { body: { messages, ...body } }
      },
    }),
  })

  useScrollOnMount()
  useScrollOnSubmit()

  const isNewChat = messages.length === 0
  const hasNewMessages = messages.length > initialMessages.length

  const lastUserIndex = messages.findLastIndex((m) => m.role === "user")
  const earlierMessages = messages.slice(0, lastUserIndex)
  const currentExchange = messages.slice(lastUserIndex)

  async function handleSendMessage(text: string) {
    const trimmedText = text.trim()

    if (hasBlockingUploads) {
      toast.error("Please wait for attachments to finish uploading")
      return
    }

    const errorCount = attachments.filter((a) => a.status === "error").length
    if (errorCount > 0) {
      toast.warning(`${errorCount} attachment(s) failed to upload and won't be included`)
    }

    let files
    try {
      files = await getSendableFileParts()
    } catch {
      toast.error("Failed to prepare attachments")
      return
    }

    if (!trimmedText && files.length === 0) return

    if (isNewChat && session) {
      if (!(await addChat(id, selectedModelId))) return
      navigateToChat()
    }

    const apiKey = getActiveKeyPayload()
    const requestOptions = { body: { modelId: selectedModelId, apiKey } }

    if (trimmedText) {
      void sendMessage({ text: trimmedText, ...(files.length > 0 ? { files } : {}) }, requestOptions)
    } else {
      void sendMessage({ files }, requestOptions)
    }

    clearAfterSend()

    if (session) {
      if (isNewChat) {
        if (trimmedText) {
          const { data: title, serverError } = await generateChatTitle({ text: trimmedText, apiKey })
          if (serverError) {
            toast.error("Failed to generate chat title")
          } else if (title) {
            await renameChat(id, title)
          }
        } else if (files.length > 0) {
          await renameChat(id, files[0].filename || "Untitled")
        }
      } else {
        await touchChat(id)
      }
    }
  }

  const chatInputProps = {
    sendMessage: handleSendMessage,
    attachments,
    onAddFiles: addFiles,
    onRemoveAttachment: removeAttachment,
    hasReadyAttachments,
    hasBlockingUploads,
  }

  const { isDragActive, dragHandlers } = useFileDragDrop({ onFilesDrop: addFiles })

  return isNewChat ? (
    <div className="relative flex h-fit w-full justify-center px-8 pt-56" {...dragHandlers}>
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-2xl">What's on your mind today?</h1>
        <ChatInput {...chatInputProps} className="mt-10" />
      </div>

      {isDragActive && <DropOverlay />}
    </div>
  ) : (
    <div className="relative flex w-full justify-center px-8" {...dragHandlers}>
      <div className="flex w-full max-w-3xl flex-col">
        <div className="flex-1 space-y-14 pt-8 pb-30">
          {earlierMessages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          <div className={cn("space-y-14", hasNewMessages && "min-h-[calc(100vh-259.25px-80px)]")}>
            {currentExchange.map((message) => (
              <Message key={message.id} message={message} />
            ))}
            {status === "submitted" && messages.at(-1)?.role === "user" && <Spinner />}
            {error && <ErrorMessage error={error} />}
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-background pb-4">
          <ChatInput {...chatInputProps} className="-translate-y-2.5" />
        </div>
      </div>

      {isDragActive && <DropOverlay />}
    </div>
  )
}
