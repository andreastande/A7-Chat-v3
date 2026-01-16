"use client"

import { ChevronDown, Folder, Pencil, Pin, Share, Trash2 } from "lucide-react"
import { useState } from "react"
import { DeleteChatDialog } from "@/components/dialogs/delete-chat-dialog"
import { RenameChatDialog } from "@/components/dialogs/rename-chat-dialog"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChatId } from "@/hooks/use-chat-id"
import { cn } from "@/lib/utils"

export function ChatHeader() {
  const chatId = useChatId()
  const chats = useChatHistoryStore((s) => s.chats)
  const [openDialog, setOpenDialog] = useState<"rename" | "delete" | null>(null)

  const chat = chats.find((c) => c.id === chatId)
  const title = chat?.title ?? "Untitled"

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
    // Show bg when title overlaps: 768 (conversation, w-3xl) + 2×(242+8) (title+padding) = 1268px
    <div className="sticky top-0 z-10 flex justify-between p-2 @max-[1268px]:sticky-shadow @max-[1268px]:bg-background">
      <Dialog onOpenChange={(open) => open === false && setOpenDialog(null)}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="font-normal data-[state=open]:bg-accent data-[state=open]:text-accent-foreground dark:data-[state=open]:bg-accent/50"
            >
              <span className={cn("w-full max-w-50 truncate", title === "Untitled" && "text-muted-foreground")}>
                {title}
              </span>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="w-44">
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

        {renderDialog(chatId!)}
      </Dialog>

      <Button variant="ghost" size="sm">
        <Share />
        Share
      </Button>
    </div>
  )
}
