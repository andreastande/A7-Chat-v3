import { cookies, headers } from "next/headers"
import type { ReactNode } from "react"
import { ApiKeysProvider } from "@/components/providers/api-keys-provider"
import { ChatHistoryProvider } from "@/components/providers/chat-history-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { getChats } from "@/dal/chat"
import { auth } from "@/lib/auth/server"

export async function Providers({ children }: { children: ReactNode }) {
  const [cookieStore, session, chats] = await Promise.all([
    cookies(),
    auth.api.getSession({ headers: await headers() }),
    getChats().catch(() => []),
  ])
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <ChatHistoryProvider initialChats={chats}>
          <SidebarProvider defaultOpen={defaultOpen}>
            <ApiKeysProvider>{children}</ApiKeysProvider>
          </SidebarProvider>
        </ChatHistoryProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
