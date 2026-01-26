"use client"

import { Globe, Paperclip, Plus } from "lucide-react"
import { Button } from "@/components/base-ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/base-ui/dropdown-menu"
import { WithTooltip } from "@/components/ui/tooltip"

export function ChatInputActions() {
  return (
    <DropdownMenu>
      <WithTooltip content="Add files and more" side="bottom" asChild>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <Plus />
        </DropdownMenuTrigger>
      </WithTooltip>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem>
          <Paperclip />
          Add files or photos
          <DropdownMenuShortcut showOnFocus>⌘D</DropdownMenuShortcut>
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
