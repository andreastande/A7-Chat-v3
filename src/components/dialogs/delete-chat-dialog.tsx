"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/base-ui/button"
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/base-ui/dialog"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
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
