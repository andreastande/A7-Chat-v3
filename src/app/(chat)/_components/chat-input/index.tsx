"use client"

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store"
import { ArrowUp, ChevronDown, Square } from "lucide-react"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ChatInputActions from "./chat-input-actions"

interface ChatInputProps {
  className?: string
  sendMessage: (msg: string) => void
}

export function ChatInput({ className, sendMessage }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const status = useChatStatus()
  const { stop } = useChatActions()

  const canSend = status === "ready" && input.trim()
  const canStop = status === "submitted" || status === "streaming"

  function handleSubmit() {
    if (canSend) {
      sendMessage(input.trim())
      setInput("")
    } else if (canStop) {
      stop()
    }
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Textarea handles keyboard input
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // Should shadcn-button default to type=button?
        const submitter = (e.nativeEvent as SubmitEvent).submitter
        if (submitter?.hasAttribute("data-submit")) {
          handleSubmit()
        }
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (!target.closest("button") && !target.closest("[data-slot=tooltip-content]")) {
          textareaRef.current?.focus()
        }
      }}
      className={cn(
        "cursor-text rounded-xl border border-input bg-background p-3 shadow-xs dark:bg-[#141416]",
        className,
      )}
    >
      <TextareaAutosize
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
        placeholder="Ask anything"
        minRows={2}
        maxRows={11}
        className="w-full resize-none pt-2 pl-2 outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
          }
        }}
      />
      <div className="mt-2 flex justify-between">
        <div className="flex items-center gap-2">
          <ChatInputActions />
          <Button variant="ghost" size="sm">
            GPT 5.2
            <ChevronDown className="text-muted-foreground" />
          </Button>
        </div>
        <Button data-submit size="icon-sm" disabled={!(canSend || canStop)}>
          {canStop ? <Square /> : <ArrowUp />}
        </Button>
      </div>
    </form>
  )
}
