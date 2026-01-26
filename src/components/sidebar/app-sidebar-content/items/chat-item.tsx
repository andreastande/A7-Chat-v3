"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuShortcut } from "@/components/ui/sidebar"

export function ChatItem() {
  const pathname = usePathname()
  const router = useRouter()

  useHotkeys("shift+mod+o", () => router.push("/"), { preventDefault: true, enableOnFormTags: true })

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
        render={<Link href="/" />}
      >
        <MessageCircle />
        Chat
        <SidebarMenuShortcut showOnFocus>⇧⌘O</SidebarMenuShortcut>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
