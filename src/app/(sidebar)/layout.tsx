import { cookies } from "next/headers"
import { AppSidebar } from "@/app/(sidebar)/_components/sidebar/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getChats } from "@/dal/chat"
import { ApiKeysProvider } from "./_components/providers/api-keys-provider"
import { ChatHistoryProvider } from "./_components/providers/chat-history-provider"

export default async function Layout({ children }: LayoutProps<"/">) {
  const [cookieStore, chats] = await Promise.all([cookies(), getChats().catch(() => [])])

  return (
    <SidebarProvider defaultOpen={cookieStore.get("sidebar_state")?.value === "true"}>
      <ChatHistoryProvider initialChats={chats}>
        <ApiKeysProvider>
          <AppSidebar />
          <div className="@container flex w-full flex-col">{children}</div>
        </ApiKeysProvider>
      </ChatHistoryProvider>
    </SidebarProvider>
  )
}
