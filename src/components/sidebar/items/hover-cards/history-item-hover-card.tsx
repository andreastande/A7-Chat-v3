import Link from "next/link"
import { type ReactNode, useState } from "react"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function HistoryItemHoverCard({ children }: { children: ReactNode }) {
  const { isMobile, state } = useSidebar()
  const [open, setOpen] = useState(false)
  const chats = useChatHistoryStore((s) => s.chats)

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={0} closeDelay={0}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent
        hasBridge
        side="right"
        align="start"
        hidden={state !== "collapsed" || isMobile}
        className="w-56 p-2"
      >
        <p className="mb-2 px-3 font-bold text-sm">History</p>
        {chats.slice(0, 10).map((c) => (
          <Button key={c.id} asChild variant="ghost" size="sm">
            <Link
              href={`/chat/${c.id}`}
              onClick={() => setOpen(false)}
              className={cn("w-full justify-start", c.title === "Untitled" && "text-muted-foreground")}
            >
              <span className="truncate text-sm">{c.title}</span>
            </Link>
          </Button>
        ))}
      </HoverCardContent>
    </HoverCard>
  )
}
