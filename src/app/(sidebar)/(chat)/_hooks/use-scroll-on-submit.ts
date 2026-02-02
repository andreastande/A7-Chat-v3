import { useMessageCount, useSelector } from "@ai-sdk-tools/store"
import { useEffect } from "react"

export function useScrollOnSubmit() {
  const messagesCount = useMessageCount()
  const lastUserMsgId = useSelector(
    "last-user-msg-id",
    (messages) => {
      const lastMsg = messages.at(-1)
      return lastMsg?.role === "user" ? lastMsg.id : null
    },
    [messagesCount],
  )

  useEffect(() => {
    if (lastUserMsgId) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }
  }, [lastUserMsgId])
}
