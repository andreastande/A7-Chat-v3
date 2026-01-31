"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
import { useSession } from "@/components/providers/session-provider"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuShortcut } from "@/components/ui/sidebar"

export function ChatItem() {
  const session = useSession()
  const pathname = usePathname()
  const router = useRouter()

  useHotkeys(
    "shift+mod+o",
    () => {
      if (session) {
        router.push("/")
      } else {
        window.location.href = "/"
      }
    },
    { preventDefault: true, enableOnFormTags: true },
  )

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={
          <>
            Chat
            <span className="ml-2 text-xs text-muted-foreground">⇧⌘O</span>
          </>
        }
        isActive={pathname === "/"}
        // oxlint-disable-next-line nextjs/no-html-link-for-pages
        render={session ? <Link href="/" /> : <a href="/" />}
      >
        <MessageCircle />
        Chat
        <SidebarMenuShortcut showOnFocus>⇧⌘O</SidebarMenuShortcut>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
