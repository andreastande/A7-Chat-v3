import Link from "next/link"
import { type ReactNode, useState } from "react"
import { useChatHistoryStore } from "@/components/providers/chat-history-provider"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useSidebar } from "@/components/ui/sidebar"
import { useChatId } from "@/hooks/use-chat-id"
import { cn } from "@/lib/utils"

export function HistoryItemHoverCard({ children }: { children: ReactNode }) {
  const { isMobile, state } = useSidebar()
  const [open, setOpen] = useState(false)
  const chats = useChatHistoryStore((s) => s.chats)
  const chatID = useChatId()

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
        <p className="mb-2 px-3 text-sm font-bold">History</p>
        <ul className="space-y-1">
          {chats.slice(0, 10).map((c) => (
            <li key={c.id}>
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`/chat/${c.id}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "w-full justify-start font-normal",
                    c.title === "Untitled" && "text-muted-foreground",
                    c.id === chatID && "bg-accent font-medium text-accent-foreground dark:bg-accent/50",
                  )}
                >
                  <span className="truncate">{c.title}</span>
                </Link>
              </Button>
            </li>
          ))}
          <li>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpen(false)}
              className="w-full justify-start bg-transparent! text-[13px] text-muted-foreground"
            >
              See all
            </Button>
          </li>
        </ul>
      </HoverCardContent>
    </HoverCard>
  )
}
