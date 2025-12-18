import { cookies, headers } from "next/headers"
import type { ReactNode } from "react"
import { SessionProvider } from "@/components/providers/session-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth/server"

export async function Providers({ children }: { children: ReactNode }) {
  const [cookieStore, session] = await Promise.all([cookies(), auth.api.getSession({ headers: await headers() })])
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

  return (
    <SessionProvider session={session}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
