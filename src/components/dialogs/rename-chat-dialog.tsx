"use client"

import { useRef, useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { Button } from "@/components/base-ui/button"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function RenameChatDialog({ chatId }: { chatId: string }) {
  const { chats, renameChat } = useChatHistoryStore(useShallow((s) => ({ chats: s.chats, renameChat: s.renameChat })))

  const chat = chats.find((c) => c.id === chatId)
  const title = chat?.title ?? "Untitled"

  const [input, setInput] = useState(title)
  const closeRef = useRef<HTMLButtonElement>(null)

  return (
    <DialogContent showCloseButton={false}>
      <DialogHeader>
        <DialogTitle>Rename chat</DialogTitle>
      </DialogHeader>
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") closeRef.current?.click()
        }}
      />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <DialogClose ref={closeRef} asChild>
          <Button
            onClick={async () => {
              const newTitle = input.trim() || "Untitled"
              if (newTitle !== title) await renameChat(chatId, newTitle)
            }}
          >
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
