"use client"

import { useMessageCount } from "@ai-sdk-tools/store"
import { useSession } from "@/components/providers/session-provider"
import { ChatHeader } from "./chat-header"
import { EmptyChatHeader } from "./empty-chat-header"
import { GuestHeader } from "./guest-header"

export function Header() {
  const session = useSession()
  const messageCount = useMessageCount()

  if (!session) {
    return <GuestHeader />
  }

  if (messageCount === 0) {
    return <EmptyChatHeader />
  }

  return <ChatHeader />
}
