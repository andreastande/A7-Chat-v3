import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { notFound } from "next/navigation"
import { getChat, getMessages } from "@/dal/chat"
import { Chat } from "../../_components/chat"
import { Header } from "../../_components/header"

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  const chat = await getChat(chatId).catch(() => null)
  if (!chat) return notFound()

  const initialMessages = await getMessages(chatId)

  return (
    <ChatProvider initialMessages={initialMessages}>
      <Header />
      <main className="flex flex-1 justify-center">
        <Chat chatId={chatId} initialMessages={initialMessages} />
      </main>
    </ChatProvider>
  )
}
