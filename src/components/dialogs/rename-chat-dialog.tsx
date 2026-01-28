"use client"

import { useEffect, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function RenameChatDialog({
  chatId,
  open,
  onOpenChange,
}: {
  chatId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { chats, renameChat } = useChatHistoryStore(useShallow((s) => ({ chats: s.chats, renameChat: s.renameChat })))

  const chat = chats.find((c) => c.id === chatId)
  const title = chat?.title ?? "Untitled"

  const [input, setInput] = useState(title)

  useEffect(() => {
    if (open) setInput(title)
  }, [open, title])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            onOpenChange(false)
            const newTitle = input.trim() || "Untitled"
            if (newTitle !== title) void renameChat(chatId, newTitle)
          }}
        >
          <Input type="text" value={input} onChange={(e) => setInput(e.target.value)} />
          <DialogFooter className="mt-6">
            <DialogClose type="button" render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
