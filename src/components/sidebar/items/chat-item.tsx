"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

function NewChatShortcut() {
  return (
    <>
      <kbd>⇧</kbd>
      <kbd>⌘</kbd>
      <kbd>O</kbd>
    </>
  )
}

export function ChatItem() {
  const pathname = usePathname()

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={
          <div className="flex items-center gap-2">
            Chat
            <kbd className="space-x-0.5 text-muted-foreground text-xs *:font-sans">
              <NewChatShortcut />
            </kbd>
          </div>
        }
        isActive={pathname === "/"}
        asChild
      >
        <Link href="/">
          <MessageCircle />
          Chat
          <kbd className="absolute top-2 right-2 hidden space-x-0.5 text-muted-foreground text-xs *:font-sans group-data-[state=expanded]:group-[:hover,:focus-visible]/menu-button:flex">
            <NewChatShortcut />
          </kbd>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
