"use client"

import { SidebarHeader, useSidebar, SidebarTrigger } from "../base-ui/sidebar"
import { WithTooltip } from "../base-ui/tooltip"

export function AppSidebarHeader() {
  const { open } = useSidebar()

  return (
    <SidebarHeader className="items-end">
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
        render={<SidebarTrigger />}
      />
    </SidebarHeader>
  )
}
