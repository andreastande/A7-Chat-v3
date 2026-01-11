"use client"

import { useRouter } from "next/navigation"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function DeleteChatDialog({ chatId }: { chatId: string }) {
  const router = useRouter()
  const removeChat = useChatHistoryStore((s) => s.removeChat)

  async function handleDelete() {
    if (!(await removeChat(chatId))) return
    router.push("/")
  }

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Delete chat</DialogTitle>
        <DialogDescription>Are you sure you want to delete this chat?</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
