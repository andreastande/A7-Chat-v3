"use client"

import { useChat } from "@ai-sdk-tools/store"
import { DefaultChatTransport, type UIMessage } from "ai"
import { AlertCircle, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { toast } from "sonner"
import { useShallow } from "zustand/react/shallow"
import { generateChatTitle } from "@/actions/chat"
import { useApiKeysStore } from "@/components/providers/api-keys-provider"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
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
  const session = useSession()
  const pathname = usePathname()
  const selectedModelId = useSelectedModelStore((s) => s.modelId)
  const getApiKey = useApiKeysStore((s) => s.getKey)
  const { addChat, touchChat, renameChat } = useChatHistoryStore(
    useShallow((s) => ({ addChat: s.addChat, touchChat: s.touchChat, renameChat: s.renameChat })),
  )
  const { id, navigateToChat } = useChatSession(chatId)
  const { messages, status, error, sendMessage } = useChat({
    id,
    messages: initialMessages,
    transport: new DefaultChatTransport({
      api: session ? "/api/chat" : "/api/chat/guest",
      prepareSendMessagesRequest({ messages, id: chatId, body }) {
        return session ? { body: { message: messages.at(-1), chatId, ...body } } : { body: { messages, ...body } }
      },
    }),
  })

  const isApiKeyError = error?.message?.includes("API key")

  const isNewChat = messages.length === 0
  const hasNewMessages = messages.length > initialMessages.length

  const lastUserIndex = messages.findLastIndex((m) => m.role === "user")
  const earlierMessages = messages.slice(0, lastUserIndex)
  const currentExchange = messages.slice(lastUserIndex)

  useScrollOnMount()
  useScrollOnSubmit()

  async function handleSendMessage(text: string) {
    if (isNewChat && session) {
      if (!(await addChat(id, selectedModelId))) return
      navigateToChat()
    }

    const userId = session?.user?.id
    const apiKey = userId ? await getApiKey("gateway", userId) : null
    const headers = apiKey ? { "X-API-Key": apiKey } : undefined

    sendMessage({ text }, { headers, body: { modelId: selectedModelId } }) // oxlint-disable-line

    if (session) {
      if (isNewChat) {
        const { data: title, serverError } = await generateChatTitle({ text })
        if (serverError) return toast.error("Failed to generate chat title")
        if (title) await renameChat(id, title)
      } else {
        await touchChat(id)
      }
    }
  }

  return isNewChat ? (
    <div className="flex h-fit w-full justify-center px-8 pt-56">
      <div className="w-full max-w-2xl">
        <h1 className="text-center text-2xl">What's on your mind today?</h1>
        <ChatInput sendMessage={handleSendMessage} className="mt-10" />
        {error && (
          <div className="bg-destructive/10 text-destructive mt-6 flex items-start gap-3 rounded-lg border border-destructive/20 p-4">
            <AlertCircle className="mt-0.5 size-5 shrink-0" />
            <div className="flex-1 space-y-2">
              <p className="font-medium">{isApiKeyError ? "API Key Required" : "Something went wrong"}</p>
              <p className="text-sm opacity-90">{error.message}</p>
              {isApiKeyError && (
                <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      render={<Link href={`${pathname}?settings=api-keys`} />}
                      nativeButton={false}
                    >
                      <Settings className="mr-2 size-4" />
                      Configure API Key
                    </Button>
              )}
            </div>
          </div>
        )}
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
            {status === "submitted" && messages.at(-1)?.role === "user" && <Spinner />}
            {error && (
              <div className="bg-destructive/10 text-destructive flex items-start gap-3 rounded-lg border border-destructive/20 p-4">
                <AlertCircle className="mt-0.5 size-5 shrink-0" />
                <div className="flex-1 space-y-2">
                  <p className="font-medium">
                    {isApiKeyError ? "API Key Required" : "Something went wrong"}
                  </p>
                  <p className="text-sm opacity-90">{error.message}</p>
                  {isApiKeyError && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      render={<Link href={`${pathname}?settings=api-keys`} />}
                      nativeButton={false}
                    >
                      <Settings className="mr-2 size-4" />
                      Configure API Key
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="sticky bottom-0 z-10 bg-background pb-4">
          <ChatInput sendMessage={handleSendMessage} className="-translate-y-2.5" />
        </div>
      </div>
    </div>
  )
}
