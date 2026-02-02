"use client"

import { MessageCircleDashed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WithTooltip } from "@/components/ui/tooltip"

export function EmptyChatHeader() {
  return (
    <div className="sticky top-0 z-10 flex h-12 justify-end p-2">
      <WithTooltip
        content="Turn on temporary chat"
        side="left"
        render={<Button variant="ghost" size="icon-sm" aria-label="Turn on temporary chat" />}
      >
        <MessageCircleDashed />
      </WithTooltip>
    </div>
  )
}
