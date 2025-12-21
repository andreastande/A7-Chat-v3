"use client"

import { ArrowUp, ChevronDown } from "lucide-react"
import { useRef } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import ChatInputActions from "./chat-input-actions"

export function ChatInput({ className }: { className?: string }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function sendMessage() {
    console.log("funker!")
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Textarea handles keyboard input
    <form
      onSubmit={(e) => {
        e.preventDefault()
        // Should shadcn-button default to type=button?
        const submitter = (e.nativeEvent as SubmitEvent).submitter
        if (submitter?.hasAttribute("data-submit")) {
          sendMessage()
        }
      }}
      onClick={(e) => {
        const target = e.target as HTMLElement
        if (!target.closest("button") && !target.closest("[data-slot=tooltip-content]")) {
          textareaRef.current?.focus()
        }
      }}
      className={cn("cursor-text rounded-xl border border-input p-3 shadow-xs dark:bg-input/30", className)}
    >
      <TextareaAutosize
        ref={textareaRef}
        autoFocus
        placeholder="Ask anything"
        minRows={2}
        maxRows={11}
        className="w-full resize-none pt-2 pl-2 outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
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
        <Button data-submit size="icon-sm">
          <ArrowUp />
        </Button>
      </div>
    </form>
  )
}
