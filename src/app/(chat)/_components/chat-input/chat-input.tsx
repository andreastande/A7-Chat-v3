"use client"

import { useChatActions, useChatStatus } from "@ai-sdk-tools/store"
import { ArrowUp, Square } from "lucide-react"
import { useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useFocusOnType } from "../../_hooks/use-focus-on-type"
import { ChatInputActions } from "./chat-input-actions"
import { ModelPicker } from "./model-picker"

interface ChatInputProps {
  className?: string
  sendMessage: (msg: string) => void
}

export function ChatInput({ className, sendMessage }: ChatInputProps) {
  const [input, setInput] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useFocusOnType(textareaRef, setInput)

  const status = useChatStatus()
  const { stop } = useChatActions()

  const canSend = status === "ready" && input.trim()
  const canStop = status === "submitted" || status === "streaming"

  function handleSubmit() {
    if (canSend) {
      sendMessage(input.trim())
      setInput("")
    } else if (canStop) {
      stop() // oxlint-disable-line
    }
  }

  return (
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
        const excludedSlots = ["tooltip-content", "popover-content"]
        if (!excludedSlots.some((slot) => (e.target as HTMLElement).closest(`[data-slot="${slot}"]`))) {
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
          <Separator orientation="vertical" className="h-4!" />
          <ModelPicker />
        </div>
        <Button data-submit size="icon-sm" disabled={!(canSend || canStop)}>
          {canStop ? <Square /> : <ArrowUp />}
        </Button>
      </div>
    </form>
  )
}
