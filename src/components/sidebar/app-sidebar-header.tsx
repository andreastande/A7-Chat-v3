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
            <kbd className="text-muted-foreground *:font-sans">
              <kbd>⌘</kbd>
              <kbd>B</kbd>
            </kbd>
          </div>
        }
        side="right"
        asChild
      >
        <Button variant="ghost" size="icon-sm" onClick={toggleSidebar}>
          <PanelLeft />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </WithTooltip>
    </SidebarHeader>
  )
}
