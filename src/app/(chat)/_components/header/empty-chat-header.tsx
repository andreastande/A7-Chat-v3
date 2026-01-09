"use client"

import { MessageCircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WithTooltip } from "@/components/ui/tooltip"

export function EmptyChatHeader() {
  return (
    <div className="sticky top-0 z-10 flex justify-end p-2">
      <WithTooltip content="Turn on temporary chat" side="left" asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Turn on temporary chat">
          <MessageCircleDashed />
        </Button>
      </WithTooltip>
    </div>
  )
}
