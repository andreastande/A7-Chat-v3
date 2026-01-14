"use client"

import { usePathname } from "next/navigation"

export function useChatId() {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const chatId = segments[1] === "chat" ? segments[2] : undefined

  return chatId
}
