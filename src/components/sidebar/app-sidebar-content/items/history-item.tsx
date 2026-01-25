"use client"

import { ChevronRight, Folder, History, MoreHorizontal, Pencil, Pin, Share, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/base-ui/collapsible"
import { Dialog } from "@/components/base-ui/dialog"
import { DeleteChatDialog } from "@/components/dialogs/delete-chat-dialog"
import { RenameChatDialog } from "@/components/dialogs/rename-chat-dialog"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
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
  const [dialogState, setDialogState] = useState<{ type: "rename" | "delete"; chatId: string } | null>(null)

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

          <CollapsibleTrigger
            render={
              <SidebarMenuAction
                className="left-1.5 bg-sidebar-accent text-sidebar-accent-foreground data-panel-open:rotate-90"
                showOnHover
              >
                <ChevronRight />
              </SidebarMenuAction>
            }
          />

          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all ease-out data-ending-style:h-0 data-starting-style:h-0">
            <SidebarMenuSub>
              {chats.slice(0, 10).map((c) => (
                <SidebarMenuSubItem key={c.id}>
                  <SidebarMenuSubButton asChild isActive={chatId === c.id} className="pr-7">
                    <Link href={`/chat/${c.id}`}>
                      <span className={cn(c.title === "Untitled" && "text-muted-foreground")}>{c.title}</span>
                    </Link>
                  </SidebarMenuSubButton>

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
                      <DropdownMenuItem onClick={() => setDialogState({ type: "rename", chatId: c.id })}>
                        <Pencil />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pin />
                        Pin
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Folder />
                        Add to project
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onClick={() => setDialogState({ type: "delete", chatId: c.id })}>
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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

          <Dialog open={dialogState?.type === "rename"} onOpenChange={(open) => !open && setDialogState(null)}>
            <RenameChatDialog chatId={dialogState?.chatId ?? ""} onClose={() => setDialogState(null)} />
          </Dialog>

          <Dialog open={dialogState?.type === "delete"} onOpenChange={(open) => !open && setDialogState(null)}>
            <DeleteChatDialog chatId={dialogState?.chatId ?? ""} onClose={() => setDialogState(null)} />
          </Dialog>
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
