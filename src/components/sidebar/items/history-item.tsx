"use client"

import { ChevronRight, History } from "lucide-react"
import Link from "next/link"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useChatId } from "@/hooks/use-chat-id"
import { cn } from "@/lib/utils"

export function HistoryItem() {
  const session = useSession()
  const chats = useChatHistoryStore((state) => state.chats)
  const chatId = useChatId()

  return (
    <SidebarMenuItem>
      {session ? (
        <Collapsible defaultOpen>
          <SidebarMenuButton>
            <History />
            History
            <kbd className="*:kbd invisible absolute top-2 right-2 flex space-x-0.5 group-data-[state=expanded]:group-[:hover,:focus-visible]/menu-button:visible">
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </kbd>
          </SidebarMenuButton>
          <CollapsibleTrigger asChild>
            <SidebarMenuAction
              className="left-1.5 bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:rotate-90"
              showOnHover
            >
              <ChevronRight />
            </SidebarMenuAction>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden transition-all data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarMenuSub>
              {chats.slice(0, 10).map((chat) => (
                <SidebarMenuSubItem key={chat.id}>
                  <SidebarMenuSubButton asChild isActive={chatId === chat.id}>
                    <Link href={`/chat/${chat.id}`}>
                      <span className={cn(chat.title === "Untitled" && "text-muted-foreground")}>{chat.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton asChild>
              <span className="cursor-not-allowed opacity-50">
                <History />
                History
              </span>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right">Log in to view your chat history</TooltipContent>
        </Tooltip>
      )}
    </SidebarMenuItem>
  )
}
