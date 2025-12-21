import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { NewChatHeader } from "./_components/chat-header"
import { NewChat } from "./_components/new-chat"

export default function Home() {
  return (
    <>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <NewChatHeader />
        <main className="flex flex-1 justify-center">
          <NewChat />
        </main>
      </div>
    </>
  )
}
