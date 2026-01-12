"use client"

import { MessageCircle } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useHotkeys } from "react-hotkeys-hook"
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
  const router = useRouter()

  useHotkeys("shift+mod+o", () => router.push("/"), { preventDefault: true, enableOnFormTags: true })

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={
          <div className="flex items-center gap-2">
            Chat
            <kbd className="*:kbd space-x-0.5">
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
          <kbd className="*:kbd invisible ml-auto space-x-0.5 group-data-[state=expanded]:group-[:hover,:focus-visible]/menu-button:visible">
            <NewChatShortcut />
          </kbd>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
