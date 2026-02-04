"use client"

import { Globe, Paperclip, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WithTooltip } from "@/components/ui/tooltip"
import { useKeyboardKeys } from "@/hooks/use-keyboard-keys"

export function ChatInputActions() {
  const { mod } = useKeyboardKeys()

  return (
    <DropdownMenu>
      <WithTooltip
        content={
          <>
            Add files and more
            <span className="ml-2 text-xs text-muted-foreground">/</span>
          </>
        }
        side="bottom"
        render={<DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />} />}
      >
        <Plus />
      </WithTooltip>
      <DropdownMenuContent className="w-52">
        <DropdownMenuItem>
          <Paperclip />
          Add files or photos
          <DropdownMenuShortcut showOnFocus>{mod}D</DropdownMenuShortcut>
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
