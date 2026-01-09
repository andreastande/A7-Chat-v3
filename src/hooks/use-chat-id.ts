"use client"

import { usePathname } from "next/navigation"

export function useChatId() {
  const pathname = usePathname()
  const chatId = pathname.split("/")[2]

  return chatId
}
