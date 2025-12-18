import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ChatHeader } from "./_components/chat-header"

export default function Home() {
  return (
    <>
      <AppSidebar />
      <div className="flex w-full flex-col">
        <ChatHeader />
        <main className="flex flex-1 items-center justify-center">
          <p>Test</p>
        </main>
      </div>
    </>
  )
}
