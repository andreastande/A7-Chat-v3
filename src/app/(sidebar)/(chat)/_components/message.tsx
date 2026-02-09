"use client"

import "katex/dist/katex.min.css"
import { useChatStatus } from "@ai-sdk-tools/store"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import { mermaid } from "@streamdown/mermaid"
import { FileText } from "lucide-react"
import { Streamdown } from "streamdown"
import type { UIMessage } from "@/types/ui-message"

function UserMessage({ message }: { message: UIMessage }) {
  const textContent = message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")

  const fileParts = message.parts.filter((part) => part.type === "file")

  return (
    <div className="ml-auto flex max-w-2xl flex-col items-end gap-2">
      {fileParts.length > 0 && (
        <div className="flex max-w-2xl flex-wrap justify-end gap-2">
          {fileParts.map((part, index) => {
            if (part.mediaType.startsWith("image/")) {
              return (
                <div key={`${message.id}-file-${index}`} className="size-24 overflow-hidden rounded-lg border border-input bg-muted/30">
                  {/* oxlint-disable-next-line eslint-plugin-next/no-img-element */}
                  <img src={part.url} alt="Attachment" className="size-full object-cover" />
                </div>
              )
            }

            const extension = part.filename?.split(".").at(-1)?.slice(0, 4)?.toUpperCase() || "FILE"

            return (
              <div
                key={`${message.id}-file-${index}`}
                className="flex w-64 items-center gap-3 rounded-lg border border-input bg-secondary/50 px-3 py-2"
              >
                <div className="grid size-8 shrink-0 place-items-center rounded-md border border-border bg-background text-[10px] font-semibold text-muted-foreground">
                  {extension}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{part.filename || "Attachment"}</p>
                </div>
                <FileText className="size-3.5 text-muted-foreground" />
              </div>
            )
          })}
        </div>
      )}

      {textContent && (
        <div className="w-fit rounded-lg bg-secondary px-4 py-3">
          <span>{textContent}</span>
        </div>
      )}
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
