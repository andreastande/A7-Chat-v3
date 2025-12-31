import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { Chat } from "./_components/chat"
import { Header } from "./_components/header"

export default function Home() {
  return (
    <>
      <AppSidebar />
      <div className="@container flex w-full flex-col">
        <ChatProvider>
          <Header />
          <main className="flex flex-1 justify-center">
            <Chat />
          </main>
        </ChatProvider>
      </div>
    </>
  )
}
