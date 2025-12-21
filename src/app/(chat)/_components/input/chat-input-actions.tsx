import { Globe, Paperclip, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { WithTooltip } from "@/components/ui/tooltip"

export default function ChatInputActions() {
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
          <kbd className="*:kbd invisible ml-auto space-x-0.5 group-[:hover,:focus-visible]/item:visible">
            <kbd>⌘</kbd>
            <kbd>U</kbd>
          </kbd>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Globe />
          Web search
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
