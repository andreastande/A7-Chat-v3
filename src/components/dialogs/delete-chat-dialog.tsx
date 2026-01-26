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
import { useChatId } from "@/hooks/use-chat-id"

export function DeleteChatDialog({ chatId, onClose }: { chatId: string; onClose: () => void }) {
  const currentChatId = useChatId()
  const router = useRouter()
  const removeChat = useChatHistoryStore((s) => s.removeChat)

  return (
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
            onClose()
            if (currentChatId === chatId) router.push("/")
            void removeChat(chatId)
          }}
        >
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
