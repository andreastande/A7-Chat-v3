import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { notFound } from "next/navigation"
import { getChat, getMessages } from "@/dal/chat"
import { getValidModelId } from "@/lib/models"
import { Chat } from "../../_components/chat"
import { Header } from "../../_components/header"
import { SelectedModelProvider } from "../../_components/providers/selected-model-provider"

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  const chat = await getChat(chatId).catch(() => null)
  if (!chat) return notFound()

  const initialMessages = await getMessages(chatId)
  const selectedModelId = getValidModelId(chat.modelId)

  return (
    <ChatProvider initialMessages={initialMessages}>
      <SelectedModelProvider initialModelId={selectedModelId}>
        <Header />
        <main className="flex flex-1 justify-center">
          <Chat chatId={chatId} initialMessages={initialMessages} />
        </main>
      </SelectedModelProvider>
    </ChatProvider>
  )
}
