import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { getMessages } from "@/dal/chat"
import { Chat } from "../../_components/chat"
import { Header } from "../../_components/header"

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  const initialMessages = await getMessages(chatId)

  return (
    <>
      <AppSidebar />
      <div className="@container flex w-full flex-col">
        <ChatProvider initialMessages={initialMessages}>
          <Header />
          <main className="flex flex-1 justify-center">
            <Chat chatId={chatId} initialMessages={initialMessages} />
          </main>
        </ChatProvider>
      </div>
    </>
  )
}
