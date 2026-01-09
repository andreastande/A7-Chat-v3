"use client"

import { useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useChatId } from "@/hooks/use-chat-id"

export function RenameChatDialog() {
  const chatId = useChatId()
  const { chats, renameChat } = useChatHistoryStore(useShallow((s) => ({ chats: s.chats, renameChat: s.renameChat })))

  const chat = chats.find((c) => c.id === chatId)
  const title = chat?.title ?? "Untitled"

  const [input, setInput] = useState(title)

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Rename chat</DialogTitle>
      </DialogHeader>
      <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button onClick={async () => await renameChat(chatId, input.trim() || "Untitled")}>Save</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
