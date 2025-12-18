import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ChatHeader } from "../../_components/chat-header"

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  return (
    <>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <ChatHeader />
        <main className="flex flex-1 items-center justify-center">
          <p>{chatId}</p>
        </main>
      </div>
    </>
  )
}
