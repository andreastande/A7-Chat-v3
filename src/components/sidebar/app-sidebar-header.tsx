"use client"

import { PanelLeft } from "lucide-react"
import { Button } from "../ui/button"
import { SidebarHeader, useSidebar } from "../ui/sidebar"
import { WithTooltip } from "../ui/tooltip"

export function AppSidebarHeader() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <SidebarHeader className="cursor-default items-end">
      <WithTooltip
        content={
          <div className="flex items-center gap-2">
            {open ? "Close sidebar" : "Open sidebar"}
            <kbd className="*:kbd">
              <kbd>⌘</kbd>
              <kbd>B</kbd>
            </kbd>
          </div>
        }
        side="right"
        asChild
      >
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={open ? "Close sidebar" : "Open sidebar"}
        >
          <PanelLeft />
        </Button>
      </WithTooltip>
    </SidebarHeader>
  )
}
