"use client"

import "katex/dist/katex.min.css"
import { useChatStatus } from "@ai-sdk-tools/store"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import type { UIMessage } from "ai"
import { Streamdown } from "streamdown"

function UserMessage({ message }: { message: UIMessage }) {
  const content = message.parts.find((part) => part.type === "text")?.text

  return (
    <div className="ml-auto w-fit max-w-2xl rounded-lg bg-secondary px-4 py-3">
      <span>{content}</span>
    </div>
  )
}

function AssistantMessage({ message }: { message: UIMessage }) {
  const status = useChatStatus()
  return message.parts.map((part, i) => {
    switch (part.type) {
      case "text":
        return (
          <Streamdown
            key={`${message.id}-${i}`}
            isAnimating={status === "streaming"}
            plugins={{ code: code, math: math, mermaid: mermaid }}
          >
            {part.text}
          </Streamdown>
        )
      default:
        return null
    }
  })
}

export function Message({ message }: { message: UIMessage }) {
  return message.role === "user" ? <UserMessage message={message} /> : <AssistantMessage message={message} />
}
