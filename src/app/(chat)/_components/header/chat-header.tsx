"use client"

import { ChevronDown, Folder, Pencil, Pin, Share, Trash2 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/base-ui/button"
import { Dialog } from "@/components/base-ui/dialog"
import { DeleteChatDialog } from "@/components/dialogs/delete-chat-dialog"
import { RenameChatDialog } from "@/components/dialogs/rename-chat-dialog"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
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

  return (
    // Show bg when title overlaps: 768 (conversation, w-3xl) + 2×(242+8) (title+padding) = 1268px
    <div className="sticky top-0 z-10 flex justify-between p-2 @max-[1268px]:sticky-shadow @max-[1268px]:bg-background">
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
          <DropdownMenuItem onClick={() => setOpenDialog("rename")}>
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
          <DropdownMenuItem variant="destructive" onClick={() => setOpenDialog("delete")}>
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openDialog === "rename"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <RenameChatDialog chatId={chatId!} onClose={() => setOpenDialog(null)} />
      </Dialog>

      <Dialog open={openDialog === "delete"} onOpenChange={(open) => !open && setOpenDialog(null)}>
        <DeleteChatDialog chatId={chatId!} onClose={() => setOpenDialog(null)} />
      </Dialog>

      <Button variant="ghost" size="sm">
        <Share />
        Share
      </Button>
    </div>
  )
}
