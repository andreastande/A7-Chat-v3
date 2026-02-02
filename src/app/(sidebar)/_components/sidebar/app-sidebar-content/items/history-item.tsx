"use client"

import { ChevronRight, Folder, History, MoreHorizontal, Pencil, Pin, Share, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { DeleteChatDialog } from "@/app/(sidebar)/_components/dialogs/delete-chat-dialog"
import { RenameChatDialog } from "@/app/(sidebar)/_components/dialogs/rename-chat-dialog"
import { useChatHistoryStore } from "@/app/(sidebar)/_components/providers/chat-history-provider"
import { useSession } from "@/components/providers/session-provider"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
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
  SidebarMenuShortcut,
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
          <HistoryItemHoverCard
            render={<SidebarMenuButton className="group-has-data-[sidebar=menu-action]/menu-item:pr-2" />}
          >
            <History />
            History
            <SidebarMenuShortcut showOnFocus>⌘K</SidebarMenuShortcut>
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

          <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-all duration-100 ease-out data-ending-style:h-0 data-starting-style:h-0">
            <SidebarMenuSub>
              {chats.slice(0, 10).map((c) => (
                <SidebarMenuSubItem key={c.id}>
                  <SidebarMenuSubButton
                    render={<Link href={`/chat/${c.id}`} />}
                    isActive={chatId === c.id}
                    className="pr-7"
                  >
                    <span className={cn(c.title === "Untitled" && "text-muted-foreground")}>{c.title}</span>
                  </SidebarMenuSubButton>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <SidebarMenuSubAction
                          showOnHover
                          className="data-popup-open:bg-sidebar-accent data-popup-open:opacity-100"
                        />
                      }
                    >
                      <MoreHorizontal />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-44">
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
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setDialogState({ type: "delete", chatId: c.id })}
                      >
                        <Trash2 />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuSubItem>
              ))}
              <SidebarMenuSubItem>
                <SidebarMenuSubButton
                  render={<button />}
                  className="w-full bg-transparent! text-[13px]! font-normal text-muted-foreground"
                >
                  <span>See all</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </CollapsibleContent>

          <RenameChatDialog
            chatId={dialogState?.chatId ?? ""}
            open={dialogState?.type === "rename"}
            onOpenChange={(open) => !open && setDialogState(null)}
          />
          <DeleteChatDialog
            chatId={dialogState?.chatId ?? ""}
            open={dialogState?.type === "delete"}
            onOpenChange={(open) => !open && setDialogState(null)}
          />
        </Collapsible>
      ) : (
        <SidebarMenuButton
          tooltip="Log in to view your chat history"
          alwaysShowTooltip
          className="cursor-not-allowed opacity-50"
        >
          <History />
          History
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  )
}
