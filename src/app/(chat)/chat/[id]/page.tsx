import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { ExistingChatHeader } from "../../_components/chat-header"

export default async function Page({ params }: PageProps<"/chat/[id]">) {
  const { id: chatId } = await params

  return (
    <>
      <AppSidebar />
      <div className="@container flex w-full flex-col">
        <ExistingChatHeader chatId={chatId} />
        <main className="flex flex-1 items-center justify-center">
          <p>Test</p>
        </main>
      </div>
    </>
  )
}
