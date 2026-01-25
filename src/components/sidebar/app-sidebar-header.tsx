"use client"

import { SidebarHeader, useSidebar, SidebarTrigger } from "../ui/sidebar"
import { WithTooltip } from "../ui/tooltip"

export function AppSidebarHeader() {
  const { open } = useSidebar()

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
        <SidebarTrigger className="size-8" />
      </WithTooltip>
    </SidebarHeader>
  )
}
