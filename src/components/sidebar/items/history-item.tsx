"use client"

import { ChevronRight, Folder, History, MoreHorizontal, Pencil, Pin, Share, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteChatDialog } from "@/components/dialogs/delete-chat-dialog"
import { RenameChatDialog } from "@/components/dialogs/rename-chat-dialog"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubAction,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useChatId } from "@/hooks/use-chat-id"
import { cn } from "@/lib/utils"
import { HistoryItemHoverCard } from "./hover-cards/history-item-hover-card"

export function HistoryItem() {
  const session = useSession()
  const chats = useChatHistoryStore((s) => s.chats)
  const chatId = useChatId()
  const [openDialog, setOpenDialog] = useState<"rename" | "delete" | null>(null)

  function renderDialog(chatId: string) {
    switch (openDialog) {
      case "rename":
        return <RenameChatDialog chatId={chatId} />
      case "delete":
        return <DeleteChatDialog chatId={chatId} />
      default:
        return null
    }
  }

  return (
    <SidebarMenuItem>
      {session ? (
        <Collapsible defaultOpen>
          <HistoryItemHoverCard>
            <SidebarMenuButton>
              <History />
              History
              <kbd className="invisible absolute top-2 right-2 flex space-x-0.5 *:kbd group-data-[state=expanded]:group-[:hover,:focus-visible]/menu-button:visible">
                <kbd>⌘</kbd>
                <kbd>K</kbd>
              </kbd>
            </SidebarMenuButton>
          </HistoryItemHoverCard>

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
              {chats.slice(0, 10).map((c) => (
                <SidebarMenuSubItem key={c.id}>
                  <SidebarMenuSubButton asChild isActive={chatId === c.id} className="pr-7">
                    <Link href={`/chat/${c.id}`}>
                      <span className={cn(c.title === "Untitled" && "text-muted-foreground")}>{c.title}</span>
                    </Link>
                  </SidebarMenuSubButton>

                  <Dialog onOpenChange={(open) => open === false && setOpenDialog(null)}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuSubAction
                          showOnHover
                          className="bg-sidebar-accent text-sidebar-accent-foreground data-[state=open]:opacity-100"
                        >
                          <MoreHorizontal />
                        </SidebarMenuSubAction>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="start" className="w-44">
                        <DropdownMenuItem>
                          <Share />
                          Share
                        </DropdownMenuItem>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={() => setOpenDialog("rename")}>
                            <Pencil />
                            Rename
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DropdownMenuItem>
                          <Pin />
                          Pin
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Folder />
                          Add to project
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DialogTrigger asChild>
                          <DropdownMenuItem variant="destructive" onSelect={() => setOpenDialog("delete")}>
                            <Trash2 />
                            Delete
                          </DropdownMenuItem>
                        </DialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {renderDialog(c.id)}
                  </Dialog>
                </SidebarMenuSubItem>
              ))}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton asChild className="w-full bg-transparent! text-[13px] text-muted-foreground">
                  <button type="button">
                    <span>See all</span>
                  </button>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view your chat history"
          tooltipHidden={false}
          className="cursor-not-allowed opacity-50"
        >
          <History />
          History
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
