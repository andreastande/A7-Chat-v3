"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
import { SidebarMenuButton, SidebarMenuItem, SidebarMenuShortcut } from "@/components/base-ui/sidebar"

export function ChatItem() {
  const pathname = usePathname()
  const router = useRouter()

  useHotkeys("shift+mod+o", () => router.push("/"), { preventDefault: true, enableOnFormTags: true })

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip="Chat" isActive={pathname === "/"} render={<Link href="/" />}>
        <MessageCircle />
        Chat
        <SidebarMenuShortcut showOnFocus>⇧⌘O</SidebarMenuShortcut>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
