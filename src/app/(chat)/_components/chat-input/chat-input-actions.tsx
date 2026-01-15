"use client"

import { Globe, Paperclip, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WithTooltip } from "@/components/ui/tooltip"

export function ChatInputActions() {
  return (
    <DropdownMenu>
      <WithTooltip content="Add files and more" side="bottom" asChild>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="trigger-active">
            <Plus />
          </Button>
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent align="start">
        <DropdownMenuItem className="group/item">
          <Paperclip />
          <span className="mr-4">Add files or photos</span>
          <kbd className="invisible ml-auto space-x-0.5 *:kbd group-[:hover,:focus-visible]/item:visible">
            <kbd>⌘</kbd>
            <kbd>U</kbd>
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Globe />
          Web search
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
