import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getChat, getChatWithMessages } from "@/dal/chat"
import { getValidModelId } from "@/lib/models"
import { Chat } from "../../_components/chat"
import { Header } from "../../_components/header"
import { SelectedModelProvider } from "../../_components/providers/selected-model-provider"

export async function generateMetadata({ params }: PageProps<"/chat/[id]">): Promise<Metadata> {
  const { id: chatId } = await params
  const chat = await getChat(chatId).catch(() => null)

  return chat ? { title: chat.title } : {}
}

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  const chat = await getChatWithMessages(chatId)
  if (!chat) return notFound()

  return (
    <ChatProvider initialMessages={chat.messages}>
      <SelectedModelProvider initialModelId={getValidModelId(chat.modelId)}>
        <Header />
        <main className="flex flex-1 justify-center">
          <Chat chatId={chatId} initialMessages={chat.messages} />
        </main>
      </SelectedModelProvider>
    </ChatProvider>
  )
}
