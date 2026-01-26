"use client"

import { WithTooltip } from "../base-ui/tooltip"
import { SidebarHeader, useSidebar, SidebarTrigger } from "../ui/sidebar"

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
        render={<SidebarTrigger className="size-8" />}
      />
    </SidebarHeader>
  )
}
