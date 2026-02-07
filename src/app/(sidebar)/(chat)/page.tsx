import { Provider as ChatProvider } from "@ai-sdk-tools/store"
import { cookies } from "next/headers"
import { getValidModelId } from "@/lib/models/utils"
import { Chat } from "./_components/chat"
import { Header } from "./_components/header"
import { SelectedModelProvider } from "./_components/providers/selected-model-provider"

export default async function Home() {
  const cookieStore = await cookies()

  return (
    <ChatProvider>
      <SelectedModelProvider initialModelId={getValidModelId(cookieStore.get("selectedModelId")?.value)}>
        <Header />
        <main className="flex flex-1 justify-center">
          <Chat />
        </main>
      </SelectedModelProvider>
    </ChatProvider>
  )
}
