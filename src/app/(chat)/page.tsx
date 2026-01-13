import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { Chat } from "./_components/chat"
import { Header } from "./_components/header"

export default function Home() {
  return (
    <ChatProvider>
      <Header />
      <main className="flex flex-1 justify-center">
        <Chat />
      </main>
    </ChatProvider>
  )
}
