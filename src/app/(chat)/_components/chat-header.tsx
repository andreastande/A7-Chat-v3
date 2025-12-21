"use client"

import { ChevronDown, MessageCircleDashed, Share } from "lucide-react"
import Link from "next/link"
import { useSession } from "@/components/providers/session-provider"
import { Button } from "@/components/ui/button"
import { WithTooltip } from "@/components/ui/tooltip"

function GuestHeader() {
  return (
    <div className="sticky top-0 z-10 flex justify-center p-2">
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/about">About</Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/features">Features</Link>
        </Button>
      </div>
      <div className="absolute right-4 flex gap-2">
        <Button size="sm" asChild>
          <Link href="/login">Log in</Link>
        </Button>
        <Button variant="outline" size="sm">
          <Link href="/signup">Sign up for free</Link>
        </Button>
      </div>
    </div>
  )
}

export function NewChatHeader() {
  const session = useSession()

  if (!session) {
    return <GuestHeader />
  }

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

export function ExistingChatHeader({ chatId }: { chatId: string }) {
  return (
    // Show bg when title overlaps: 768 (conversation, w-3xl) + 2×(242+8) (title+padding) = 1268px
    <div className="sticky top-0 z-10 flex justify-between @max-[1268]:bg-background p-2">
      <Button variant="ghost" size="sm">
        <span className="w-full max-w-50 truncate">A Tale of Fortune and Disaster ({chatId})</span>
        <ChevronDown />
      </Button>
      <Button variant="ghost" size="sm">
        <Share />
        Share
      </Button>
    </div>
  )
}
