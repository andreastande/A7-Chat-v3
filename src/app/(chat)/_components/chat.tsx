"use client"

import { useChat } from "@ai-sdk-tools/store"
import { DefaultChatTransport, type UIMessage } from "ai"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
import { generateChatTitle } from "@/actions/chat"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { cn } from "@/lib/utils"
import { useChatSession } from "../_hooks/use-chat-session"
import { useScrollOnMount } from "../_hooks/use-scroll-on-mount"
import { useScrollOnSubmit } from "../_hooks/use-scroll-on-submit"
import { ChatInput } from "./chat-input"
import { Message } from "./message"
import { useSelectedModelStore } from "./providers/selected-model-provider"

interface ChatProps {
  chatId?: string
  initialMessages?: UIMessage[]
}

export function Chat({ chatId, initialMessages = [] }: ChatProps) {
  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const { addChat, touchChat, renameChat } = useChatHistoryStore(
    useShallow((s) => ({ addChat: s.addChat, touchChat: s.touchChat, renameChat: s.renameChat })),
  )
  const { id, navigateToChat } = useChatSession(chatId)
  const { messages, sendMessage } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      prepareSendMessagesRequest({ messages, id: chatId, body }) {
        return { body: { message: messages[messages.length - 1], chatId, ...body } }
      },
    }),
  })

  const isNewChat = messages.length === 0
  const hasNewMessages = messages.length > initialMessages.length

  const lastUserIndex = messages.findLastIndex((m) => m.role === "user")
  const earlierMessages = messages.slice(0, lastUserIndex)
  const currentExchange = messages.slice(lastUserIndex)

  useScrollOnMount()
  useScrollOnSubmit()

  async function handleSendMessage(text: string) {
    if (isNewChat) {
      if (!(await addChat(id, selectedModelId))) return
      navigateToChat()
    }

    sendMessage({ text }, { body: { modelId: selectedModelId } }) // oxlint-disable-line

    if (isNewChat) {
      const { data: title, serverError } = await generateChatTitle({ text })
      if (serverError) return toast.error("Failed to generate chat title")
      if (title) await renameChat(id, title)
    } else {
      await touchChat(id)
    }
  }

  return isNewChat ? (
    <div className="flex h-fit w-full justify-center px-8 pt-56">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-2xl">What's on your mind today?</h1>
        <ChatInput sendMessage={handleSendMessage} className="mt-10" />
      </div>
    </div>
  ) : (
    <div className="flex w-full justify-center px-8">
      <div className="flex w-full max-w-3xl flex-col">
        <div className="flex-1 space-y-14 pt-8 pb-30">
          {earlierMessages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          <div className={cn("space-y-14", hasNewMessages && "min-h-[calc(100vh-259.25px-80px)]")}>
            {currentExchange.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-background pb-4">
          <ChatInput sendMessage={handleSendMessage} className="-translate-y-2.5" />
        </div>
      </div>
    </div>
  )
}
