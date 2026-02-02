"use client"

import { useRouter } from "next/navigation"
import { useChatHistoryStore } from "@/app/(sidebar)/_components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useChatId } from "@/hooks/use-chat-id"

export function DeleteChatDialog({
  chatId,
  open,
  onOpenChange,
}: {
  chatId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const currentChatId = useChatId()
  const router = useRouter()
  const removeChat = useChatHistoryStore((s) => s.removeChat)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Delete chat</DialogTitle>
          <DialogDescription>Are you sure you want to delete this chat?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onOpenChange(false)
              if (currentChatId === chatId) router.push("/")
              void removeChat(chatId)
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
