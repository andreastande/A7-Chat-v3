"use client"

import { useChatActions } from "@ai-sdk-tools/store"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

/**
 * Manages chat session lifecycle: ID generation, shallow routing to /chat/<id>,
 * and resetting state when navigating back to /.
 */
export function useChatSession(chatId?: string) {
  const pathname = usePathname()
  const hasNavigated = useRef(false)
  const [id, setId] = useState(() => chatId ?? crypto.randomUUID())

  const { setNewChat } = useChatActions()

  useEffect(() => {
    if (pathname === "/" && hasNavigated.current) {
      hasNavigated.current = false
      const newId = crypto.randomUUID()
      setId(newId)
      setNewChat(newId, [])
    }
  }, [pathname, setNewChat])

  function navigateToChat() {
    if (!hasNavigated.current) {
      window.history.pushState(null, "", `/chat/${id}`)
      hasNavigated.current = true
    }
  }

  return { id, navigateToChat }
}
